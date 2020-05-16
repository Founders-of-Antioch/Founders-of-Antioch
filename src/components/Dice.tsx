import React from "react";

type DiceState = {
  diceOneValue: number;
  diceTwoValue: number;
};

type DiceProps = {
  diceOneX: number;
  diceOneY: number;
};

const widthOfSVG = Number(document.getElementById("root")?.offsetWidth);
const heightOfSVG = Number(document.getElementById("root")?.offsetHeight);
const diceLength = widthOfSVG / 20;

export class Dice extends React.Component<DiceProps, DiceState> {
  constructor(props: DiceProps) {
    super(props);
    this.state = {
      diceOneValue: 3,
      diceTwoValue: 3,
    };
  }

  // randn_bm(min: number, max: number, skew: number) {
  //   let u = 0,
  //     v = 0;
  //   while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  //   while (v === 0) v = Math.random();
  //   let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  //   num = num / 10.0 + 0.5; // Translate to 0 -> 1
  //   if (num > 1 || num < 0) num = this.randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  //   num = Math.pow(num, skew); // Skew
  //   num *= max - min; // Stretch to fill range
  //   num += min; // offset to min
  //   return num;
  // }

  roll() {
    this.setState({
      diceOneValue: 1,
      diceTwoValue: 2,
    });
  }

  makeNumberCircles(color: string) {
    const { diceOneValue, diceTwoValue } = this.state;
    const { diceOneX, diceOneY } = this.props;

    if (diceOneValue % 2 !== 0) {
      let dotArr = [];

      for (let i = 0; i < 5; i++) {
        // More garbage to adjust for dynamic screen size - there's probably too much of this
        let currentX = diceOneX + (i + 1) * (diceLength / 4);
        let currentY = diceOneY + diceLength / 2 + (-i + 1) * (diceLength / 4);

        if (i === 3) {
          currentX = diceOneX + (i - 2) * (diceLength / 4);
          currentY = diceOneY + diceLength / 2 + (-i + 2) * (diceLength / 4);
        } else if (i === 4) {
          currentX = diceOneX + (i - 1) * (diceLength / 4);
          currentY = diceOneY + diceLength / 2 + (-i + 5) * (diceLength / 4);
        }

        dotArr.push(
          <circle
            cx={currentX}
            cy={currentY}
            r={diceLength / 10}
            fill={color}
          />
        );
      }
      return dotArr;
    }
  }

  render() {
    // let normd: { [key: number]: number } = {};
    // for (let i = 0; i < 100000; i++) {
    //   const randDistr = Math.floor(this.randn_bm(2, 12, 1));
    //   if (randDistr in normd) {
    //     normd[randDistr] += 1;
    //   } else {
    //     normd[randDistr] = 1;
    //   }
    // }
    // console.log(normd);

    const { diceOneX: diceOneCX, diceOneY: diceOneCY } = this.props;

    return (
      <g>
        <rect
          width={diceLength}
          height={diceLength}
          x={diceOneCX}
          y={diceOneCY}
          rx={diceLength / 5}
          fill="#efd601"
        />
        <rect
          width={diceLength}
          height={diceLength}
          x={diceLength}
          y="0"
          rx={diceLength / 5}
          fill="#bf0704"
        />
        {/* <circle
          cx={diceLength / 2}
          cy={diceLength / 2}
          r={diceLength / 10}
          fill="#bf0704"
        /> */}
        {this.makeNumberCircles("#bf0704")}
      </g>
    );
  }
}
