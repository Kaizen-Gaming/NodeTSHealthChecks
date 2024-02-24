import HealthCheckInterface from "./domain";
import { HealthCheckEntityModel, HealthCheckModel } from "./models";
import HealthCheckStatusEnum from "./health_check_enum";

export class HealthCheckFactory {
    private _healthItems: Array<HealthCheckInterface>;
    private _health!: HealthCheckModel;
    private _entityStartTime!: number;
    private _totalStartTime!: number;
    private _entityStopTime!: number;
    private _totalStopTime!: number;

    constructor() {
        this._healthItems = []
    }

    public add = (item: HealthCheckInterface) => this._healthItems.push(item);

    private _checkHealthItem = async (healthItem: HealthCheckInterface): Promise<void> => {
        const item = new HealthCheckEntityModel(healthItem.alias, healthItem.tags);
        this._startTimer(true);

        try {
            item.status = await healthItem.checkHealth();
        } catch (error) {
            const { message } = error as { message: string };

            console.error(`Error checking health for ${healthItem.alias}: ${message}`);
            item.status = HealthCheckStatusEnum.UNHEALTHY;
        }

        this._stopTimer(true);
        item.timeTaken = this._getTimeTaken(true);

        if (item.status == HealthCheckStatusEnum.UNHEALTHY) {
            this._health.status = HealthCheckStatusEnum.UNHEALTHY;
        }

        this._health.entities.push(item);
    }

    public check = async (): Promise<HealthCheckModel> => {
        this._health = new HealthCheckModel();
        this._startTimer(false);

        await Promise.all(this._healthItems.map(this._checkHealthItem));

        this._stopTimer(false);

        this._health.totalTimeTaken = this._getTimeTaken(false);
        return this._health;
    }

    private _startTimer = (entityTimer: boolean): void => {
        if (entityTimer) {
            this._entityStartTime = Date.now();
        }
        else {
            this._totalStartTime = Date.now();
        }
    }

    private _stopTimer = (entityTimer: boolean): void => {
        if (entityTimer) {
            this._entityStopTime = Date.now();
        }
        else {
            this._totalStopTime = Date.now();
        }
    }

    private _getTimeTaken = (entityTimer: boolean): string => {
        const start = entityTimer ? this._entityStartTime : this._totalStartTime;
        const stop = entityTimer ? this._entityStopTime : this._totalStopTime;

        const duration = stop - start;
        return this._msToTime(duration);
    };

    private _msToTime = (duration: number): string => {
        let milliseconds = Math.floor((duration % 1000));
        let seconds = Math.floor((duration / 1000) % 60);
        let minutes = Math.floor((duration / (1000 * 60)) % 60);
        let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        let hoursString = (hours < 10) ? "0" + hours : hours.toString();
        let minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
        let secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();

        return `${hoursString}:${minutesString}:${secondsString}.${milliseconds}`;
    }
}

export default HealthCheckFactory
