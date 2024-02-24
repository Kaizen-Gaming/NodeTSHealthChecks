import HealthCheckStatusEnum from "./health_check_enum"

export class HealthCheckEntityModel {
    readonly alias: string
    readonly tags: Array<string>
    status: HealthCheckStatusEnum
    timeTaken?: string

    constructor(alias: string, tags: Array<string>) {
        this.status = HealthCheckStatusEnum.HEALTHY;
        this.alias = alias;
        this.tags = tags;
    }
}

export class HealthCheckModel {
    entities: Array<HealthCheckEntityModel>
    status: HealthCheckStatusEnum
    totalTimeTaken?: string

    constructor() {
        this.status = HealthCheckStatusEnum.HEALTHY;
        this.entities = [];
    }
}
