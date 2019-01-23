import React, { Component } from 'react';
import './App.css';

import Mousetrap from 'mousetrap';

const parseSpacing = (val) => typeof val === "number" ? `${val || 0}px` : val || '0';

const Padding = (props) => <Spacing property="padding" {...props} />

const Margin = (props) => <Spacing property="margin" {...props} />

const Card = ({ children }) => <div className="card">{children}</div>

const Row = ({ children }) => <div className="row">{children}</div>

const SpacedRow = ({ children }) =>
  <div className="row row--spaced">{children}</div>

const RowRight = ({ children }) =>
  <div className="row__right">{children}</div>

const Col = ({ children, size }) => {
  const width = `${100 * size / 12}%`;
  return (
    <div style={{ width: width }}>
      {children}
    </div>
  );
}

const Button = ({ children, onClick }) =>
  <button onClick={onClick} className="button">
    {children}
  </button>

const TextInput = ({ value, onChange }) =>
  <input
    className="text-input"
    type="text"
    value={value}
    onChange={onChange}
  />

const Spacing = ({
  children,
  property,
  all,
  sides,
  ends,
  top,
  right,
  bottom,
  left
}) => {
  const padding = `
    ${parseSpacing([top, ends, all].find(x => x))}
    ${parseSpacing([right, sides, all].find(x => x))}
    ${parseSpacing([bottom, ends, all].find(x => x))}
    ${parseSpacing([left, sides, all].find(x => x))}
  `;

  return (
    <div style={{[property]: padding}}>
      {children}
    </div>
  );
}

class Item extends Component {
  handleDelete() {
    this.props.handleDelete(this.props.idx);
  }

  render() {
    const { label } = this.props;
    return (
      <Col size={3}>
        <Margin all={12}>
          <Card>
            <Padding all={12}>
              <Row>
                {label}
                <RowRight>
                  <Button
                    onClick={this.handleDelete.bind(this)}
                  >
                    Delete
                  </Button>
                </RowRight>
              </Row>
            </Padding>
          </Card>
        </Margin>
      </Col>
    );
  }
}

class Todo extends Component {
  constructor() {
    super();
    this.state = {
      text: '',
      items: ['Todo 1', 'Todo 2', 'Todo 3', 'Todo 4', 'Todo 5'],
    }

    this.updateText = this.updateText.bind(this);
    this.submitItem = this.submitItem.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    // Mousetrap.bind('enter', this.submitItem);
  }

  updateText(e) {
    this.setState({ text: e.target.value });
  }

  submitItem(e) {
    e.preventDefault();
    this.setState(({ items, text }) => ({
      items: [...items, text],
      text: '',
    }));
  }

  handleDelete(idx) {
    this.setState(({ items }) => ({
      items: items.filter((item, i) => i !== idx)
    }));
  }

  renderItems() {
    return this.state.items.map((item, idx) =>
      <Item key={idx} label={item} idx={idx} handleDelete={this.handleDelete} />
    )
  }

  render() {
    return (
      <Padding all={24}>
        <form onSubmit={this.submitItem}>
          <SpacedRow>
              <TextInput
                type="text"
                value={this.state.text}
                onChange={this.updateText}
              />
              <Button
                onClick={this.submitItem}
              >
                Submit
              </Button>
          </SpacedRow>
        </form>
        <Padding ends={24}>
          <Row>
            {this.renderItems()}
          </Row>
        </Padding>
      </Padding>
    );
  }
}

export default Todo;
