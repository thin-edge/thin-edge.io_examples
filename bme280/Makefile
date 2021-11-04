all: local_bme280
all: cloud_bme280
all: tedge_bme280

local_bme280: local_bme280.c bme280/bme280.o
	gcc -Wall -O2 -I bme280 -o local_bme280 local_bme280.c bme280/bme280.o -lwiringPi

cloud_bme280: cloud_bme280.c bme280/bme280.o
	gcc -Wall -O2 -I bme280 -o cloud_bme280 cloud_bme280.c bme280/bme280.o -lwiringPi -lpaho-mqtt3c

tedge_bme280: tedge_bme280.c bme280/bme280.o
	gcc -Wall -O2 -I bme280 -o tedge_bme280 tedge_bme280.c bme280/bme280.o -lwiringPi -lpaho-mqtt3c

bme280/bme280.o:
	make -C bme280

clean:
	rm local_bme280
	rm cloud_bme280
	rm tedge_bme280
