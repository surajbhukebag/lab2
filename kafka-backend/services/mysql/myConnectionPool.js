
function MyConnectionPool() {

	this.connections = [];

	costructor(var size) {
		this.connections = new Array(size);
	}


    this.getConsumer = function(topic_name) {      

            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0 }]);
            this.client.on('ready', function () { console.log('client ready!') })
     
        return this.kafkaConsumerConnection;
    };

   
}
exports = module.exports = new MyConnectionPool;