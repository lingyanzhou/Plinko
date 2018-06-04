var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Peg(phxEngine, stage, objRegisters, color, radius) {
  GameObject.call(this, phxEngine, stage, objRegisters);
  this.phxObj = Bodies.circle(-1000, 0, radius, {
    isStatic: true,
    collisionFilter: {
      category: 0x4,
      mask: 0x1
    },
  });
  this.sprite = new PIXI.Graphics();
  this.sprite.beginFill(color);
  this.sprite.drawCircle(0, 0, radius);
  this.sprite.endFill();
}
Peg.prototype = Object.create(GameObject.prototype);

Peg.prototype.updateView = function () {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
}
