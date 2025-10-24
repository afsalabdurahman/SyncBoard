export interface ApiResponse<T> {
  data: {
   
    items: T[];

    totalItems: number;
  };
}
