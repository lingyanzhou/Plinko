var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Wall(phxEngine, stage, objRegisters, color, width, height) {
  GameObject.call(this, phxEngine, stage, objRegisters);
  this.phxObj = Bodies.fromVertices(-1000, 0, [{x:0, y:-height}, {x:-width/2, y:0}, {x:0, y:height}, {x:width/2, y:0}], {
    isStatic: true,
    collisionFilter: {
      category: 0x2,
      mask: 0x1
    }
  });
  this.sprite = new PIXI.Graphics();
  this.sprite.beginFill(color);
  this.sprite.drawPolygon([new PIXI.Point(0, -height), new PIXI.Point(-width/2, 0), new PIXI.Point(0, height), new PIXI.Point(width/2, 0)]);
  this.sprite.endFill();
}
Wall.prototype = Object.create(GameObject.prototype);

Wall.prototype.updateView = function () {
  this.sprite.x = this.phxObj.position.x;
  this.sprite.y = this.phxObj.position.y;
}
