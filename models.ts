import HealthCheckStatusEnum from "./health_check_enum"

class HealthCheckEntityModel {
    alias: string
    status: HealthCheckStatusEnum = HealthCheckStatusEnum.HEALTHY
    timeTaken?: string
    tags: Array<string>

    constructor(alias: string, tags:Array<string>){
        this.alias = alias;
        this.tags = tags;
    }
}

class HealthCheckModel {
    status: HealthCheckStatusEnum
    totalTimeTaken?: string
    entities: Array<HealthCheckEntityModel>

    constructor() {
        this.status = HealthCheckStatusEnum.HEALTHY;
        this.entities = [];
    }
}

export { HealthCheckEntityModel, HealthCheckModel }