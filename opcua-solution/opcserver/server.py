import sys

from opcua.ua.uaprotocol_auto import ServerStatusDataType
sys.path.insert(0, "..")
import time
import math
import logging
import datetime
import random

from opcua import ua, Server


if __name__ == "__main__":
    logger = logging.getLogger('Server')
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    logger.info('Logger for Server was initialised')

    # setup our server
    logger.info('Starting Server')
    server = Server()
    logger.info('Setting endpoint')
    server.set_endpoint("opc.tcp://0.0.0.0:4840/")
    logger.info('Setting Servername')
    server.set_server_name("Example OPCUA Server")

    server.set_security_policy([ua.SecurityPolicyType.NoSecurity])
    # setup our own namespace, not really necessary but should as spec
    uri = "http://thin-edge.io"
    idx = server.register_namespace(uri)

    objects = server.get_objects_node()

    # get Objects node, this is where we should put our nodes
    types = server.get_node(ua.ObjectIds.BaseObjectType)
    object_type_to_derive_from = server.get_root_node().get_child(["0:Types", 
                                                                   "0:ObjectTypes", 
                                                                   "0:BaseObjectType"])
    # create object type & object
    mycustomobj_type = types.add_object_type(idx, "Maschinen_Type_III")
    mycustomobj_type.add_variable(0, "power_variable", 220.0).set_modelling_rule(True) #if false it would not be instantiated
    mycustomobj_type.add_property(idx, "device_id", "123456").set_modelling_rule(True)

     # First a folder to organise our nodes
    myCompany = server.nodes.objects.add_folder(idx, "Maschinenbau")
    myobj = myCompany.add_object(idx, "Maschinen Type III", mycustomobj_type.nodeid)
    myWerk = myCompany.add_folder(idx, "Werk 2")
    myCompany.add_folder(idx, "Werk 1")
    myCompany.add_folder(idx, "Werk 3")
    myHalle = myWerk.add_folder(idx, "Halle 3")
    myLinie= myHalle.add_folder(idx, "Linie 4")
    myMachine= myLinie.add_folder(idx, "Machine 0815")
    drives = myMachine.add_object(idx, "Drives")
    spindel = myMachine.add_object(idx, "Spindel")
    table = myMachine.add_object(idx, "Table")
    power=  drives.add_variable(idx, "Power", 6.7)
    amplitude =  drives.add_variable(idx, "Amplitude", 20.0)
    current = drives.add_variable(idx, "Current", 6.7)
    resolution = drives.add_variable(idx, "Resolution", 100)
    power.set_writable()    # Set MyVariable to be writable by clients
    current.set_writable()
    resolution.set_writable()
    amplitude.set_writable()
    ctrl = myMachine.add_object(idx, "Controller")
    ctrl.set_modelling_rule(True)
    state = ctrl.add_property(idx, "State", "Idle")
    state.set_writable()
    state.set_modelling_rule(True)

    # starting!
    server.start()

    # enable data change history for this particular node, must be called after start since it uses subscription
    server.historize_node_data_change(power, period=None, count=100)
    try:
        i = 0
        logger.info('Starting loop')
        frequency = resolution.get_value()
        state.set_value("active")
        while True:
            i = i + 1
            time.sleep(2)
            seconds = time.time()
            simPower = amplitude.get_value() * abs( math.sin(seconds * frequency / 100) )
            current.set_value( round(math.cos(seconds) * 10.0, 2))
            frequency = frequency + 0.05 * frequency * random.randint(- 1,1 )   # Step direction (-1, 0, +1)
            power.set_value(round(simPower,2))
            if ( i == 50 ):
                state.set_value("Idle")
            elif ( i == 100 ):
                state.set_value("Active")
            elif ( i >= 150 ):
                i = 0
            simState = state.get_value()
            logger.info('Power: ' + str(round(simPower,2)) + ' Status: ' + str(simState))
    finally:
        #close connection, remove subcsriptions, etc
        server.stop()
