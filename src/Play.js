class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 500
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)
        this.wallB = wallB
        this.wallBRight = true

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirection = pointer.y <= this.ball.y ? 1 : -1
            let hype = Math.sqrt((this.ball.body.x - pointer.x) ** 2 + (this.ball.body.y - pointer.y) ** 2)
            let velocityX = (this.ball.body.x - pointer.x) / hype
            let velocityY = (this.ball.body.y - pointer.y) / hype
            this.ball.body.setVelocityX(velocityX * 750)
            this.ball.body.setVelocityY(velocityY * 750)
            //this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            //this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })  //square root of sum of the squared x and y differences divide that number by Cx and Cy (maybe multiply by 100)

        //cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (b, cup) => {
            b.body.x = width / 2 
            b.body.y = height - height / 10
            b.body.setVelocityX(0)
            b.body.setVelocityY(0) 
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {
       if(this.wallBRight) {
        this.wallB.x += 2 
       } else {
        this.wallB.x -= 2
       }
       if(this.wallB.x >= width - (this.wallB.body.width) / 2) {
        this.wallBRight = false
       } else if(this.wallB.x <= this.wallB.body.width / 2){
        this.wallBRight = true
       }


       

    }
}
/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[X] Add ball reset logic on successful shot
[X] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[X] Make one obstacle move left/right and bounce against screen edges
[ ] Create and display shot counter, score, and successful shot percentage
*/