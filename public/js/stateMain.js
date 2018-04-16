var StateMain = {
    preload: function() {
        game.load.image("background", "images/background.png")
        game.load.image("mountains1", "images/mountains1.png")
        game.load.image("mountains2", "images/mountains2.png")
        game.load.image("testBackground", "images/testBackground.png")
        game.load.image("grass", "images/grass.png");
        game.load.image("bar", "images/powerbar.png");
        game.load.image("block", "images/block.png");
        game.load.image("playAgain", "images/playAgain.png")
        game.load.image("clouds", "images/clouds.png")

        // Chars
        game.load.atlasJSONHash('hound', 'images/hellhound-psd.png', 'images/hellhound-psd.json' )
        game.load.atlasJSONHash('bird', 'images/bird.png', 'images/bird.json')    
        game.load.atlasJSONHash('hero', 'images/explorer.png', 'images/explorer.json' )
    },
    create: function() {

      // Set clickLock to false
      this.clickLock = false
      this.power = 0
      
      //turn the background sky blue
      this.background = game.add.tileSprite(0, 0,game.width, game.height, "testBackground")
      this.background.autoScroll(-10, 0)
        
      // Mountains
      this.mountain1 = game.add.tileSprite(0,0, game.width, game.height/2, "mountains1")
      this.mountain1.y = game.height - this.mountain1.height

      this.mountain2 = game.add.tileSprite(0,0, game.width, game.height/3, "mountains2")
      this.mountain2.y = game.height -this.mountain2.height

      this.mountain1.autoScroll(-50, 0)
      this.mountain2.autoScroll(-60,0)


      // Add the ground
      this.ground = game.add.tileSprite(0, game.height * .9 , game.width, 60, "grass")
      // We only want to scroll by x, so leave y at 0
      this.ground.autoScroll(-15, 0)

      // Add the hero
      this.hero = game.add.sprite(game.width * .2, this.ground.y, "hero")

      // Scaling hero. Test different here to see how it works.
      
      this.hero.animations.add("die", this.makeArray(0, 10), 12, false)
      this.hero.animations.add("jump", this.makeArray(20, 30), 12, false)
      this.hero.animations.add("run", this.makeArray(30, 40), 12, true)
      this.hero.animations.play("run")
      
      this.hero.width = game.width / 14
      this.hero.scale.y = this.hero.scale.x
      this.hero.anchor.set(0.5, 1)

      // Add the power bar just above the head of the hero
      this.powerBar = game.add.sprite(this.hero.x + 25, this.hero.y - 25, "bar")
      this.powerBar.width = 0

       // Adding cloud
       this.clouds = game.add.sprite(0, 0, "clouds")
       this.clouds.width = game.width
      
      // Start the physics engine
      game.physics.startSystem(Phaser.Physics.ARCADE)

      // Enable the hero for physics
      game.physics.enable(this.hero, Phaser.Physics.ARCADE)
      this.hero.body.gravity.y = 800
      this.hero.body.collideWorldBounds = true

      // Enable the ground for physics
      game.physics.enable(this.ground, Phaser.Physics.ARCADE)
      this.ground.body.immovable = true

      // Record the initial position
      this.startY = this.hero.y

      // Set listeners
      game.input.onDown.add(this.mouseDown, this)

      // Adding blocks
      this.blocks = game.add.group()
      this.makeBlocks()

      // Adding Bird
      this.makeBird()

      // Adding Hound
      //this.makeHound()

    },

    makeArray: function(start, end) {
        let myArray = []
        for (let i = start; i < end; i++) {
            myArray.push(i)
        }
        return myArray
    },
    
    // Functions for mouse down and up
    mouseDown: function() {

        if (this.clickLock === true) {
            return
        }

        if (this.hero.y != this.startY) {
            return
        }
        game.input.onDown.remove(this.mouseDown, this)
        this.timer = game.time.events.loop(Phaser.Timer.SECOND/1000, this.increasePower, this )
        game.input.onUp.add(this.mouseUp, this)
    },
    
    mouseUp: function() {
        game.input.onUp.remove(this.mouseUp, this)
        this.doJump()
        game.time.events.remove(this.timer)
        this.power = 0
        this.powerBar.width = 0
        game.input.onDown.add(this.mouseDown, this)
        this.hero.animations.play("jump")
    },
    increasePower: function() {
        this.power++
        this.powerBar.width = this.power
        if (this.power > 50) {
            this.power = 50
        }
    },

    doJump: function() {
        this.hero.body.velocity.y = -this.power * 18
    },

    makeBlocks: function () {
        // Remove all blocks from the group
        this.blocks.removeAll()
        let wallHeight = game.rnd.integerInRange(1, 5)
        for (let i = 0; i < wallHeight; i++) {
            let block = game.add.sprite(0, -i * 50, "block")
            this.blocks.add(block)
        }
        this.blocks.x = game.width - this.blocks.width
        this.blocks.y = this.ground.y - 50

        // LOOP through each block
        // and apply physics
        this.blocks.forEach(function(block) {
            // enable physics
            game.physics.enable(block, Phaser.Physics.ARCADE)
            // Set the x velocity to -160
            block.body.velocity.x = -250
            // Apply some gravity to the block
            // not too much or the blocks will bounce against each other
            block.body.gravity.y = 4
            // Set the bounce so the blocks
            // Will react to the runner
            block.body.bounce.set(1, 1)
        })
            
    },

    /*makeHound: function () {
        if (this.hound) {
            this.hound.destroy()
        }

        this.hound = game.add.sprite(game.width + 100, this.ground.y, "hound")
        this.hound.animations.add('run', this.makeArray(0, 5), 10, true)
        this.hound.animations.play('run')

        // Set hound size

            this.hound.width = game.width / 5
            this.hound.scale.y = this.hound.scale.x
           
        
            this.hound.anchor.set(0.5, 1)
            
            
        
        
        
       
        
        
        
        
      

        // Set hound physics
        game.physics.enable(this.hound, Phaser.Physics.ARCADE)

        // Set hound velocity
        this.hound.body.velocity.x = -200

        // Set hound gravity
        this.hound.body.gravity.y = 200
        

        // Set bounce for hound



    },*/

    makeBird: function () {
        // If bird already exists
        // destroy it

        if(this.bird) {
            this.bird.destroy()
        }
        // Pick a number at the top of the screen
        // between 10 percent and 40 percent of the height of the screen

        let birdY = game.rnd.integerInRange(game.height * .1, game.height * .4)
        
        // Add the bird sprite to the game

        this.bird = game.add.sprite(game.width + 100, birdY, "bird")
        this.bird.animations.add('fly', this.makeArray(0,8),12, true)
        this.bird.animations.play('fly')

        // Set the birds size
        this.bird.width = game.width * .05
        this.bird.scale.y = this.bird.scale.x
        this.bird.scale.x = -this.bird.scale.x

        // Enable the sprite for the physics
        game.physics.enable(this.bird, Phaser.Physics.ARCADE)

        // Set the x-velocity at -200 which is a little faster than the block
        
        this.bird.body.velocity.x = -450
        
        // Set the bounce for the bird
        
        this.bird.body.bounce.set(2, 2)

    },

    onGround() {
        if (this.hero) {
            this.hero.animations.play("run")
        }
    },

    update: function() {
        game.physics.arcade.collide(this.hero, this.ground, this.onGround, null, this)

        game.physics.arcade.collide(this.hound, this.ground)


        // Collide the hero with the blocks
        game.physics.arcade.collide(this.hero, this.blocks, this.delayOver, null, this)

        game.physics.arcade.collide(this.hero, this.hound, this.delayOver, null, this)

        
        // Collide the hero with bird
        game.physics.arcade.collide(this.hero, this.bird, this.delayOver, null, this)
        
        // Collide the blocks with the ground
        game.physics.arcade.collide(this.ground, this.blocks)


        // When only specifying one group, all children in that
        // group will collide with each other
        game.physics.arcade.collide(this.blocks)

        // get the first child
        let firstChild = this.blocks.getChildAt(0)
        
        // If off the screen reset the blocks
        if (firstChild.x < -game.width) {
            this.makeBlocks()
        }
        
        // If the bird has flown off screen
        // reset it
        if (this.bird.x < 0) {
            this.makeBird()
        }

        // If the hound has run off screen
        // reset it
        //if (this.hound.x < 0) {
         //   this.makeHound()
        //}

        // If touches clouds
        if (this.hero.y < this.hero.height) {
            this.hero.body.velocity.y = 200
            this.delayOver()
        }
        
    },

    delayOver: function() {
        this.clickLock = true
        if (this.hero) {
            this.hero.animations.play("die")
            this.hero.body.velocity.y = 100
        }
        game.time.events.add(Phaser.Timer.SECOND, this.gameOver, this)
    },

    gameOver: function() {
        game.state.start("StateOver")
    }
}