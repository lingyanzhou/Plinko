var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner || Matter.Runner;

function Game(ele, debugEle) {
  this.loaded = false;
  this.started = false;
  this.phxEngine = Engine.create();
  World.add(this.phxEngine.world, [
    Bodies.rectangle(Game.WIDTH/2, -100, 2000, 200, {isStatic: true, collisionFilter: {group:0, category:0x8, mask: 0x1}}),
    Bodies.rectangle(Game.WIDTH/2, Game.HEIGHT+100, 2000, 200, {isStatic: true, collisionFilter: {group:0, category:0x8, mask: 0x1}}),
    Bodies.rectangle(-100, Game.HEIGHT/2, 200, 2000, {isStatic: true, collisionFilter: {group:0, category:0x8, mask: 0x1}}),
    Bodies.rectangle(Game.WIDTH+100, Game.HEIGHT/2, 200, 2000, {isStatic: true, collisionFilter: {group:0, category:0x8, mask: 0x1}})
  ]);

  if (debugEle != null) {
    this.debugRender = Render.create({
      element: document.querySelector(debugEle),
      engine: this.phxEngine,
      bounds: {
        min: { x: 0, y: 0 },
        max: { x: Game.WIDTH+0, y: Game.HEIGHT+0 }
      },
      options: {
        width: Game.WIDTH+0,
        height: Game.HEIGHT+0,
        wireframes: true,

      }
    });
    Render.run(this.debugRender);
  }

  this.app = new PIXI.Application({
    width: Game.WIDTH,
    height: Game.HEIGHT,
    autoStart: false,
    view: document.querySelector(ele),
    backgroundColor: '#ffffff'
  });

  this.stage = this.app.stage;
  this.backgroundContainer = new PIXI.Container();
  this.unitContainer = new PIXI.Container();
  this.stage.addChild(this.backgroundContainer);
  this.stage.addChild(this.unitContainer);
  this.bg = new PIXI.Sprite();
  this.bg.width = Game.WIDTH;
  this.bg.height = Game.HEIGHT;
  this.backgroundContainer.addChild(this.bg);
  this.ballRegister = [];
  this.pegRegister = [];
  this.messageRegister = [];
  this.wallRegister = [];

  var x=0, y=0, tmp = null, i=0, left = 0;
  for (y = Game.PEG_VPOS_RANGE.min; y <= Game.PEG_VPOS_RANGE.max; y += Game.PEG_VINTERVAL) {
    if (i % 2 == 0) {
      left = Game.PEG_HINTERVAL / 2;
    } else {
      left = 0;
    }
    for (x = left; x <= Game.WIDTH; x += Game.PEG_HINTERVAL) {
      tmp = new Peg(this.phxEngine, this.backgroundContainer, [this.pegRegister], 0x333333, Game.PEG_RADIUS);
      Body.setPosition(tmp.phxObj, {'x': x, 'y': y});
      tmp.register();
    }
    i += 1;
  }
  x=0; tmp = null;

  for (x=0; x <= Game.WIDTH; x+= Game.PEG_HINTERVAL) {
    tmp = new Wall(this.phxEngine, this.backgroundContainer, [this.wallRegister], 0x333333, Game.WALL_WIDTH, Game.WALL_HEIGHT);
    Body.setPosition(tmp.phxObj, {'x': x, 'y': Game.HEIGHT});
    tmp.register();
  }

  this.app.ticker.add(this.tick, this);
  this.app.ticker.start();

  this.app.loader.add('bg', Game.BACKGROUND_IMG).load(function(loader, resources) {
    this.bg.texture = resources.bg.texture;
  }.bind(this))
  this.setUpControls(ele);
}

Game.BACKGROUND_IMG = "img/wood-background.png";
Game.BALL_RADIUS_RANGE = {min: 2, max: 12};
Game.PEG_RADIUS = 2;
Game.PEG_HINTERVAL = 50;
Game.PEG_VINTERVAL = Game.PEG_HINTERVAL / 2;
Game.PEG_VPOS_RANGE = {min: 100, max: 600};
Game.WALL_WIDTH = 10;
Game.WALL_HEIGHT = 100;
Game.WIDTH = 400;
Game.HEIGHT = 800;
Game.RELEASE_POS = {x: Game.WIDTH/2, y:10};
Game.RELEASE_MAX_SPEED = 0.5;

Game.prototype.randomReleaseSpeed = function () {
  var speed = Math.random() * Game.RELEASE_MAX_SPEED;
  var angle = Math.random() * Math.PI * 2;
  return {x: speed * Math.sin(angle), y: speed * Math.cos(angle)};
}

Game.prototype.randomColor = function () {
  return Math.floor(Math.random()*0xffffff);
}

Game.prototype.randomBallSize = function () {
  return Math.random()*(Game.BALL_RADIUS_RANGE.max-Game.BALL_RADIUS_RANGE.min)+Game.BALL_RADIUS_RANGE.min;
}

Game.prototype.releaseBall = function () {
  var tmp = new Ball(this.phxEngine, this.backgroundContainer, [this.ballRegister], this.randomColor(), this.randomBallSize());
  Body.setPosition(tmp.phxObj, Game.RELEASE_POS);
  Body.setVelocity(tmp.phxObj, this.randomReleaseSpeed());
  tmp.register();
}

Game.prototype.setUpControls= function (ele) {
  $(ele).click(function () {
    game.releaseBall();
  });
  $(window).keydown(function (e) {
    if (e.which === 32) {
      game.releaseBall();
      e.stopPropagation();
      e.preventDefault();
    } else if (e.which === 27) {
      game.restart();
      e.stopPropagation();
      e.preventDefault();
    }
  });
}

Game.prototype.restart = function () {
  this.clearBalls();
  this.start();
}

Game.prototype.start = function () {
  //TODO
};

Game.prototype.clearBalls = function () {
  for (var o of this.ballRegister.slice()) {
    o.unregister();
    o.destroy();
  }
};

Game.prototype.tick = function (dt) {
  for (var o of this.pegRegister) {
    o.updateView(dt);
  }
  for (var o of this.wallRegister) {
    o.updateView(dt);
  }
  for (var o of this.ballRegister) {
    o.updateView(dt);
  }

  Engine.update(this.phxEngine,  this.app.elapsedMS);
  this.app.renderer.render(this.app.stage);
};
