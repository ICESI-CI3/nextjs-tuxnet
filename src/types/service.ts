import { ServiceUser} from "../services/serviceService"

export interface Service {
  id: string;
  name: string;
  category?: string;
  durationMin: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  users?: ServiceUser[];

}
