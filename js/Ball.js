var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Ball(phxEngine, stage, objRegisters, color, radius) {
  GameObject.call(this, phxEngine, stage, objRegisters);
  this.phxObj = Bodies.circle(-1000, 0, radius, {
    collisionFilter: {
      category: 0x1,
      mask: 0xf
    },
  });
  this.sprite = new PIXI.Graphics();
  this.sprite.beginFill(color);
  this.sprite.drawCircle(0, 0, radius);
  this.sprite.endFill();
}

Ball.prototype = Object.create(GameObject.prototype);

Ball.prototype.updateView = function () {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
}
