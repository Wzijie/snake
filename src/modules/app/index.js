import React, { Component } from 'react';
import './index.css';

const initialMapSize = 15;
const cellWidth = 50;

class App extends Component {

  state = {
    stageMap: new Array(Math.pow(initialMapSize ,2)).fill(0),
    snake: [2, 1, 0],
    direction: 'R',
    food: [],
    mapSize: initialMapSize
  }

  componentDidMount() {
    document.addEventListener('keydown', (event) => {
      if ([37, 38, 39, 40].indexOf(event.keyCode) === -1) return;
      event.preventDefault();
      const { direction } = this.state;
      switch (event.keyCode) {
        case 37:
          if (direction !== 'R') this.onChangeDirection('L');
          return;
        case 38:
          if (direction !== 'B') this.onChangeDirection('T');
          return;
        case 39:
          if (direction !== 'L') this.onChangeDirection('R');
          return;
        case 40:
          if (direction !== 'T') this.onChangeDirection('B');
          return;
        default: return;
      }
    });
  }

  onChangeDirection = (direction) => {
    this.setState(() => {
      return { direction };
    });
  }

  move = (next) => {
    const { stageMap, snake, food } = this.state;
    if (next === 'collision' || stageMap[next] === undefined || snake.indexOf(next) !== -1) {
      this.endMove();
      alert('collision');
      return;
    }
    if (food.indexOf(next) !== -1) {
      this.eat(next);
      return;
    }
    let newSnake = snake.slice();
    newSnake.unshift(next);
    newSnake.pop();
    this.setState(() => {
      return { snake: newSnake };
    });
  }

  startMove = () => {
    this.endMove();
    this.moveTimer = setInterval(this.switchDirectionMove, 300);
    this.productionFood();
  }

  endMove = () => {
    clearInterval(this.moveTimer);
  }

  switchDirectionMove = () => {
    const { snake, direction, mapSize } = this.state;
    switch (direction) {
      case 'L':
        if (snake[0] % mapSize === 0) {
          this.move('collision');
        } else {
          this.move(snake[0] - 1);
        }
        return;
      case 'T':
        this.move(snake[0] - mapSize);
        return;
      case 'R':
        if (snake[0] % mapSize === mapSize - 1) {
          this.move('collision');
        } else {
          this.move(snake[0] + 1);
        }
        return;
      case 'B':
        this.move(snake[0] + mapSize);
        return;
      default: return;
    }
  }

  productionFood = () => {
    const { stageMap, snake, food } = this.state;
    let restCell = [];
    stageMap.forEach((cell, index) => {
      if (snake.indexOf(index) === -1 && food.indexOf(index) === -1) restCell.push(index);
    });
    let foodCoord = restCell[Math.floor(Math.random() * restCell.length)];
    this.setState(({ food }) => {
      let newFood = [...food, foodCoord];
      return { food: newFood };
    });
  }

  eat = (next) => {
    const { snake, food } = this.state;
    let newSnake = [next, ...snake];
    let newFood = food.slice();
    newFood.splice(newFood.indexOf(next), 1);
    this.setState(() => {
      return {
        snake: newSnake,
        food: newFood
      };
    });
    this.productionFood();
  }

  reset = () => {
    this.endMove();
    this.setState(() => {
      return {
        snake: [2, 1, 0],
        direction: 'R',
        food: []
      };
    });
  }

  render() {
    const { stageMap, snake, food, mapSize } = this.state;
    return (
      <div className="App">
        <ul className='map' style={{ width: `${mapSize * cellWidth}px` }}>
          {
            stageMap.map((cell, index) => {
              let snakeClassName = snake.indexOf(index) !== -1 && 'snake';
              let foodClassName = food.indexOf(index) !== -1 && 'food';
              return <li key={index} className={`map__li ${snakeClassName} ${foodClassName}`}>{index}</li>;
            })
          }
        </ul>
        <div className='control'>
          <button className='control__button' onClick={this.startMove}>开始</button>
          <button className='control__button' onClick={this.endMove}>暂停</button>
          <button className='control__button' onClick={this.switchDirectionMove}>前进一步</button>
          <button className='control__button' onClick={this.productionFood}>生成食物</button>
          <button className='control__button' onClick={this.reset}>重新开始</button>
        </div>
      </div>
    );
  }
}

export default App;
