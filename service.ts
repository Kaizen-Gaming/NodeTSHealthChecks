import HealthCheckInterface from "./domain";
import { HealthCheckEntityModel, HealthCheckModel } from "./models";
import HealthCheckStatusEnum from "./health_check_enum";

class HealthCheckFactory {
    private _healthItems: Array<HealthCheckInterface>;
    private _health!: HealthCheckModel;
    private _entityStartTime!: Date
    private _totalStartTime!: Date
    private _entityStopTime!: Date
    private _totalStopTime!: Date

    constructor() {
        this._healthItems = []
    }

    public add = (item: HealthCheckInterface) => this._healthItems.push(item);

    public check = async (): Promise<HealthCheckModel> => {
        this._health = new HealthCheckModel();
        this._startTimer(false);
        for (const healthItem of this._healthItems) {
            let item = new HealthCheckEntityModel(healthItem.alias, healthItem.tags);
            this._startTimer(true);
            item.status = await healthItem.checkHealth();
            this._stopTimer(true);
            item.timeTaken = this._getTimeTaken(true)
            if (item.status == HealthCheckStatusEnum.UNHEALTHY) {
                this._health.status = HealthCheckStatusEnum.UNHEALTHY;
            }
            this._health.entities.push(item);
        }

        this._stopTimer(false);
        this._health.totalTimeTaken = this._getTimeTaken(false)
        return this._health;
    }

    private _startTimer = (entityTimer: boolean) => {
        if (entityTimer) {
            this._entityStartTime = new Date();
        }
        else {
            this._totalStartTime = new Date();
        }
    }

    private _stopTimer = (entityTimer: boolean) => {
        if (entityTimer) {
            this._entityStopTime = new Date();
        }
        else {
            this._totalStopTime = new Date();
        }
    }

    private _getTimeTaken = (entityTimer: boolean): string => {
        let duration: number;
        if (entityTimer) {
            duration = this._entityStopTime.valueOf() - this._entityStartTime.valueOf();
        }
        else {
            duration = this._totalStopTime.valueOf() - this._totalStartTime.valueOf()
        }

        return this._msToTime(duration);
    }

    private _msToTime = (duration: number) => {
        let milliseconds = Math.floor((duration % 1000));
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
      
        let hoursString = (hours < 10) ? "0" + hours : hours;
        let minutesString = (minutes < 10) ? "0" + minutes : minutes;
        let secondsString = (seconds < 10) ? "0" + seconds : seconds;
      
        return hoursString + ":" + minutesString + ":" + secondsString + "." + milliseconds;
      }
}

export default HealthCheckFactory