var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function GameObject(phxEngine, stage, objRegisters) {
  this.phxEngine = phxEngine;
  this.stage = stage;
  this.phxObj = null;
  this.objRegisters = objRegisters;
  this.sprite = null;
  this.customMovement = null;
}

GameObject.prototype.updateView = function () {
}

GameObject.prototype.register = function () {
  World.add(this.phxEngine.world, this.phxObj);
  this.stage.addChild(this.sprite);
  for (r of this.objRegisters) {
    r.push(this);
  }
}

GameObject.prototype.unregister = function () {
  Matter.Composite.remove(this.phxEngine.world, this.phxObj);
  this.stage.removeChild(this.sprite);
  for (r of this.objRegisters) {
    r.splice(r.indexOf(this), 1);
  }
}

GameObject.prototype.destroy = function () {
  this.sprite.destroy();
}
