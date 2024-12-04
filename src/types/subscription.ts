export interface Stop {
  id: string;
  name: string;
  routes?: Route[];
}

export interface Route {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
}

export interface SubscriptionFormData {
  stopId: string;
  routeId: string;
  date: string;
} 