import { HealthDetail } from "./healthDetail";

export interface HealthData {
  status: string;
  components: { [key: string]: HealthDetail };
}