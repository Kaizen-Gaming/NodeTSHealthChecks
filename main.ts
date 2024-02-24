import HealthCheckFactory from "./service";
import HealthCheckStatusEnum from "./health_check_enum";
import HealthCheckInterface from "./domain";

class ExampleHealthCheck implements HealthCheckInterface {
    readonly alias: string;
    readonly tags: Array<string>;

    constructor(alias: string, tags: Array<string>) {
        this.alias = alias;
        this.tags = tags;
    }

    checkHealth = async (): Promise<HealthCheckStatusEnum> => {
        return Math.random() < 0.8 ? HealthCheckStatusEnum.HEALTHY : HealthCheckStatusEnum.UNHEALTHY;
    };
}

async function main() {
    const healthCheckFactory = new HealthCheckFactory();

    healthCheckFactory.add(new ExampleHealthCheck("Service1", ["tag1", "tag2"]));
    healthCheckFactory.add(new ExampleHealthCheck("Service2", ["tag3", "tag4"]));

    const result = await healthCheckFactory.check();
    console.log("Health Check:", result);
}

main();
