import { Kafka } from "kafkajs";

const kafka = new Kafka({
    clientId: "user-service",
    brokers: ["kafka:9092"],
});

const producer = kafka.producer();
//const consumer = kafka.consumer({ groupId: "user-service-group" });
const connectProducer = async () => {
    await producer.connect();
    console.log("Kafka Producer connected successfully");
}

const publishEvent =  async (topic, message) => {
    try {
        await connectProducer();
        await producer.send({
            topic,
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
        await getTopics();
        console.log("Event published successfully");
    } catch (error) {
        console.error("Error publishing event:", error);
    }
}

const getTopics = async() => {
    const admin = kafka.admin();
    await admin.connect();
    const topics = await admin.listTopics();
    console.log("Existing topics:", topics);
    await admin.disconnect();
    return topics;
}

export { connectProducer, publishEvent };