import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

class Graph extends Component<IProps, {}> {
  // Perspective Table instance
  private table: Table | undefined;

  render() {
    return (
      <perspective-viewer></perspective-viewer>
    )
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_bid_price: 'float',
      top_bid_size: 'integer',
      top_ask_price: 'float',
      top_ask_size: 'integer',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (elem) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_bid_price", "top_ask_price"]');
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct count',
        top_bid_price: 'avg',
        top_bid_size: 'avg',
        top_ask_price: 'avg',
        top_ask_size: 'avg',
        timestamp: 'distinct count',
      }));
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(this.props.data.map((el: any) => {
        return {
          stock: el.stock,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          top_bid_size: el.top_bid && el.top_bid.size || 0,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_ask_size: el.top_ask && el.top_ask.size || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;

