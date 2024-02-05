import HealthCheckStatusEnum from "./health_check_enum";

interface HealthCheckInterface {
    readonly alias: string
    readonly tags: Array<string>

    checkHealth: () => Promise<HealthCheckStatusEnum>;
}

export default HealthCheckInterface