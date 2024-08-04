export interface Order {
  price: Number,
  size: Number,
}
/**
 * The datafeed server returns an array of ServerRespond with 2 stocks.
 * We do not have to manipulate the ServerRespond for the purpose of this task.
 */
export interface ServerRespond {
  stock: string,
  top_ask: { price: number },
  top_bid: { price: number },
  timestamp: Date,
}

class DataStreamer {
  static getData(callback: (data: ServerRespond[]) => void) {
    fetch('http://localhost:8080/query')  // Update the URL based on your backend setup
      .then(response => response.json())
      .then(data => callback(data));
  }
}

export default DataStreamer;
