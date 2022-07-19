// spawn
const { spawn } = require('child_process');
const pty = require('node-pty-prebuilt-multiarch');
const { TaskQueue } = require('./taskqueue');
const fs = require('fs');
// emmitter to signal completion of current task

const propertiesToJSON = require('properties-to-json');
const MongoClient = require('mongodb').MongoClient;

const MONGO_URL = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
const MONGO_MEASUEMENT_COLLECTION = 'measurement'
const MONGO_SERIES_COLLECTION = 'serie'
const MONGO_DB = 'localDB'
const ANALYTICS_CONFIG = '/etc/tedge/tedge-ui/analyticsConfig.json'
const MAX_MEASUREMENT = 2000;

class ThinEdgeBackend {

    static cmdInProgress = false;
    static measurementCollection = null;
    static seriesCollection = null;
    shell = null;
    taskQueue = null;


    constructor(socket) {
        this.socket = socket;

        // bind this to all methods of notifier
        Object.keys(this.notifier).forEach(key => {
            this.notifier[key] = this.notifier[key].bind(this)
        });
        console.log(`New constructor for socket: ${socket.id}`)
        if (ThinEdgeBackend.measurementCollection == null || ThinEdgeBackend.seriesCollection == null) {
            console.error(`Connect to mongo first: ${socket.id}`)
        } else {
            this.watchMeasurementCollection();
        }

        this.shell  = pty.spawn('sh', [], {
            name: 'xterm-color',
            cols: 80,
            rows: 30,
            cwd: "/",
            env: process.env
          });
        this.initShell(this.shell, this.socket);
        this.taskQueue = new TaskQueue(this.shell)
        console.error(`Initialized taskQueue: ${this.taskQueue }`)
    }

    initShell(sh, so) {
        const socket = so;
        const shell = sh;
        this.socket.on('shell-input', function (data) {
            console.log("New shell-input:", data, data.length)
            shell.write(data);
        });

        shell.on('data', function (data) {
            console.log("New shell-ouput:",data)
            socket.emit('shell-output', Buffer.from(data));
        });

        shell.on('exit', function (exitCode, signal) {
            console.log("New shell-exit:",exitCode, signal)
            const data = "Shell exited with code: " + exitCode;
            socket.emit('shell-exit', Buffer.from(data));
        })
    }

    notifier = {
        sendProgress: function (job, task) {
            this.socket.emit('job-progress', {
                status: 'processing',
                progress: task.id,
                total: task.total,
                job: job,
                cmd: task.cmd + " " + task.args.join(' ')
            });
        },
        sendResult: function (result) {
            this.socket.emit('job-output', result);
        },
        sendError: function (job, task, exitCode) {
            this.cmdInProgress = false;
            this.socket.emit('job-output', `${exitCode} (task ${task.id})`);
            this.socket.emit('job-progress', {
                status: 'error',
                progress: task.id,
                job: job,
                total: task.total
            });
        },
        sendJobStart: function (job, promptText, length) {
            this.cmdInProgress = true;
            this.socket.emit('job-progress', {
                status: 'start-job',
                progress: 0,
                job: job,
                promptText: promptText,
                total: length
            });
        },
        sendJobEnd: function (job, task) {
            this.cmdInProgress = false;
            this.socket.emit('job-progress', {
                status: 'end-job',
                progress: task.id,
                job: job,
                total: task.total
            });
        }
    }

    watchMeasurementCollection() {
        let changeStream = undefined;
        let localSocket = this.socket;
        // watch measurement collection for changes
        localSocket.on('new-measurement', function (message) {
            console.log(`New measurement cmd: ${message}`);
            // only start new changed stream if no old noe exists
            if (message == 'start' && !changeStream) {
                console.log(`Really starting measurement cmd: ${message}`);
                changeStream = ThinEdgeBackend.measurementCollection.watch()
                changeStream.on("change", function (change) {
                    // console.log("changed", JSON.stringify(change.fullDocument));
                    // let obj = JSON.parse(change.fullDocument.payload)
                    // change.fullDocument.payload = obj
                    // console.log("changed", JSON.stringify(change.fullDocument));
                    localSocket.emit('new-measurement', JSON.stringify(change.fullDocument))
                });
            } else if (message == 'stop') {
                if (changeStream) {
                    console.log(`Stop message stream: ${message}`);
                    changeStream.close()
                    changeStream = undefined;
                }
            }
        });
    }

    static getMeasurements(req, res) {
        let displaySpan = req.query.displaySpan;
        let dateFrom = req.query.dateFrom;
        let dateTo = req.query.dateTo;
        if (displaySpan) {
            console.log("Measurement query (last, after):", displaySpan, new Date(Date.now() - 1000 * parseInt(displaySpan)));
            let query = {
                datetime: { // 18 minutes ago (from now)
                    $gt: new Date(Date.now() - 1000 * parseInt(displaySpan))
                }
            }
            ThinEdgeBackend.measurementCollection.find(query).limit(MAX_MEASUREMENT).sort({ datetime: 1 }).toArray(function (err, items) {
                if (err) {
                    console.error("Can't retrieve measurements!")
                    throw err;
                }
                res.status(200).json(items);
            });
        } else {
            console.log("Measurement query (from,to):", dateFrom, dateTo);
            let query = {
                datetime: { // 18 minutes ago (from now)
                    $gt: new Date(dateFrom),
                    $lt: new Date(dateTo)
                }
            }
            ThinEdgeBackend.measurementCollection.find(query).limit(MAX_MEASUREMENT).sort({ datetime: 1 }).toArray(function (err, items) {
                if (err) {
                    console.error("Can't retrieve measurements!")
                    throw err;
                }
                res.status(200).json(items);
            });
        }
    }

    static connect2Mongo() {
        if (ThinEdgeBackend.measurementCollection == null || ThinEdgeBackend.seriesCollection == null) {
            console.log('Connecting to mongo ...');
            MongoClient.connect(MONGO_URL, function (err, client) {
                if (err) throw err;
                let dbo = client.db(MONGO_DB);
                ThinEdgeBackend.measurementCollection = dbo.collection(MONGO_MEASUEMENT_COLLECTION)
                ThinEdgeBackend.seriesCollection = dbo.collection(MONGO_SERIES_COLLECTION)
            });
        }
    }

    static getSeries(req, res) {
        ThinEdgeBackend.seriesCollection.find().toArray(function (err, items) {
            let result = []
            for (let index = 0; index < items.length; index++) {
                if (err) throw err;
                const item = items[index];
                let series = []
                for (const property in item) {
                    if (property != '_id' && property != 'type' && property != 'time')
                        series.push(property)
                }
                const measurement = {
                    name: item.type,
                    series: series
                }
                result.push(measurement)
                //onsole.log('Series from mongo', item, serie); 
            }
            res.status(200).json(result);
        });
    }

    static getEdgeConfiguration(req, res) {
        try {
            let sent = false;
            var stdoutChunks = [];
            const child = spawn('tedge', ['config', 'list']);

            child.stdout.on('data', (data) => {
                stdoutChunks = stdoutChunks.concat(data);
            });
            child.stderr.on('data', (data) => {
                console.error(`Output stderr: ${data}`);
                res.status(500).json(data);
                sent = true;
            });

            child.on('error', function (err) {
                console.error('Error : ' + err);
                res.status(500).json(err);
                sent = true;
            });

            child.stdout.on('end', (data) => {
                console.log('Output stdout:', Buffer.concat(stdoutChunks).toString());
                if (!sent) {
                    let stdoutContent = Buffer.concat(stdoutChunks).toString();
                    let config = propertiesToJSON(stdoutContent)
                    res.status(200).json(config);
                }
            });
            console.log('Retrieved configuration')
        } catch (err) {
            console.error("Error when reading configuration: " + err)
            res.status(500).json({ data: err });
        }
    }

    static getEdgeServiceStatus(req, res) {
        try {
            let sent = false;
            var stdoutChunks = [];

            const child = spawn('sh', ['-c', 'rc-status -s | sed -r "s/ {30}//" | sort'])

            child.stdout.on('data', (data) => {
                stdoutChunks = stdoutChunks.concat(data);
            });
            child.stderr.on('data', (data) => {
                console.error(`Output stderr: ${data}`);
                res.status(500).json(data);
                sent = true;
            });

            child.on('error', function (err) {
                console.error('Error : ' + err);
                res.status(500).json(err);
                sent = true;
            });

            child.stdout.on('end', (data) => {
                console.log('Output stdout:', Buffer.concat(stdoutChunks).toString());
                if (!sent) {
                    let stdoutContent = Buffer.concat(stdoutChunks).toString();
                    //stdoutContent = stdoutContent.replace( /.*defunct.*\n/g, '')
                    res.status(200).send({ result: stdoutContent });
                }
            });
            console.log('Retrieved job status')
        } catch (err) {
            console.error("Error when executing top: " + err)
            res.status(500).json({ data: err });
        }
    }

    static async getAnalyticsConfiguration(req, res) {
        let configuration
        try {
            let ex = await ThinEdgeBackend.fileExists(ANALYTICS_CONFIG)
            if (!ex) {
                await fs.promises.writeFile(ANALYTICS_CONFIG, '{"expertMode": false}');
            }
            let rawdata = await fs.promises.readFile(ANALYTICS_CONFIG);
            let str = rawdata.toString()
            configuration = JSON.parse(str);
            res.status(200).json(configuration);
            console.debug('Retrieved configuration', configuration)
        } catch (err) {
            console.error("Error when reading configuration: " + err)
            res.status(500).json({ data: err });
        }
    }

    static async setAnalyticsConfiguration(req, res) {
        let configuration = req.body
        try {
            await fs.promises.writeFile(ANALYTICS_CONFIG, JSON.stringify(configuration))
            res.status(200).json(configuration);
            console.log('Saved configuration', configuration)
        } catch (err) {
            console.error("Error when saving configuration: " + err)
            res.status(500).json({ data: err });
        }
    }

    static async fileExists(filename) {
        try {
            await fs.promises.stat(filename);
            return true;
        } catch (err) {
            //console.log("Testing code: " + err.code)
            if (err.code === 'ENOENT') {
                return false;
            } else {
                throw err;
            }
        }
    }

    reset(msg) {
        try {
            console.log('Starting resetting ...')
            const tasks = [
                {
                    cmd: 'sudo',
                    args: ["tedge", "cert", "remove"]
                },
                {
                    cmd: 'sudo',
                    args: ["tedge", "disconnect", "c8y"]
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "mosquitto", "stop"]
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "tedge-mapper-c8y", "stop"]
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "tedge-agent", "stop"]
                },
                {
                    cmd: 'echo',
                    args: ["Finished resetting edge"]
                }]
            if (!this.cmdInProgress) {
                this.taskQueue.queueTasks(msg.job, msg.promptText, tasks, true)
                this.taskQueue.registerNotifier(this.notifier)
                this.taskQueue.start()
            } else {
                this.socket.emit('job-progress', {
                    status: 'ignore',
                    progress: 0,
                    total: 0
                });
            }
        } catch (err) {
            console.error(`The following error occured: ${err.message}`)
        }
    }

    restartPlugins(msg) {
        try {
            console.log('Restart plugins  ...')
            const tasks = [
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "c8y-configuration-plugin", "restart"]
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "c8y-log-plugin", "restart"]
                },]
            if (!this.cmdInProgress) {
                this.taskQueue.queueTasks(msg.job, msg.promptText, tasks, true)
                this.taskQueue.registerNotifier(this.notifier)
                this.taskQueue.start()
            } else {
                this.socket.emit('job-progress', {
                    status: 'ignore',
                    progress: 0,
                    total: 0
                });
            }
        } catch (err) {
            console.error(`The following error occured: ${err.message}`)
        }
    }


    configure(msg) {
        try {
            console.log(`Starting configuration of edge: ${msg.deviceId}, ${msg.tenantUrl}`)

            const tasks = [
                {
                    cmd: 'sudo',
                    args: ["tedge", "cert", "create", "--device-id", msg.deviceId]
                },
                {
                    cmd: 'sudo',
                    args: ["tedge", "config", "set", "c8y.url", msg.tenantUrl]
                },
                {
                    cmd: 'sudo',
                    args: ["tedge", "config", "set", "mqtt.external.port", "8883"]
                },
                {
                    cmd: 'sudo',
                    args: ["tedge", "config", "set", "mqtt.external.bind_address", "0.0.0.0"]
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "collectd", "restart"]
                },
            ]
            if (!this.cmdInProgress) {
                this.taskQueue.queueTasks(msg.job, msg.promptText, tasks, false)
                this.taskQueue.registerNotifier(this.notifier)
                this.taskQueue.start()
            } else {
                this.socket.emit('job-progress', {
                    status: 'ignore',
                    progress: 0,
                    total: 0
                });
            }
        } catch (err) {
            console.error(`The following error occured: ${err.message}`)
        }
    }

    stop(msg) {
        try {
            console.log(`Stopping edge processes ${this.cmdInProgress}...`)
            const tasks = [
                {
                    cmd: 'sudo',
                    args: ['tedge', 'disconnect', 'c8y'],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "mosquitto", "stop"],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "tedge-mapper-c8y", "stop"],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "tedge-agent", "stop"],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "collectd", "stop"],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "tedge-mapper-collectd", "stop"],
                    continueOnError: true
                }
            ]
            if (!this.cmdInProgress) {
                this.taskQueue.queueTasks(msg.job, msg.promptText, tasks, true)
                this.taskQueue.registerNotifier(this.notifier)
                this.taskQueue.start()
            } else {
                this.socket.emit('job-progress', {
                    status: 'ignore',
                    progress: 0,
                    total: 0
                });
            }
        } catch (err) {
            console.error(`The following error occured: ${err.message}`)
        }
    }

    start(msg) {
        try {
            console.log(`Starting edge ${this.cmdInProgress}...`)
            const tasks = [
                {
                    cmd: 'sudo',
                    args: ['tedge', 'connect', 'c8y'],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "collectd", "start"],
                    continueOnError: true
                },
                {
                    cmd: 'sudo',
                    args: ["/sbin/rc-service", "tedge-mapper-collectd", "start"]
                }
            ]

            if (!this.cmdInProgress) {
                this.taskQueue.queueTasks(msg.job, msg.promptText, tasks, false)
                this.taskQueue.registerNotifier(this.notifier)
                this.taskQueue.start()
            } else {
                this.socket.emit('job-progress', {
                    status: 'ignore',
                    progress: 0,
                    total: 0
                });
            }

        } catch (err) {
            console.error(`Error when starting edge:${err}`, err)
        }
    }

}
module.exports = { ThinEdgeBackend }