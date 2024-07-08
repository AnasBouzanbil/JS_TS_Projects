player2_bar = 10;
function draw_anvas_element()
{
    player1_bar = 10;
    player2_bar = 10;
    var canva= document.getElementById("gameCanvas");
    var ctx = canva.getContext("2d");
    var canva_width = canva.width;
    var canva_height = canva.height;
    var ball_x = canva_width / 2;
    var ball_y = canva_height / 2;
    var ballVelocityy =1;
    var ballVelocityx = 1;
    keypressed= [];
    function vec2(x, y)
    {
        return {x: x, y: y};
    }
    document.addEventListener("keydown", function(event) {
        console.log('some key is pressed');
        if (event.keyCode == 40) {
            console.log("down pressed");
            keypressed[40] = true;
        } else if (event.keyCode == 38) {
            console.log("up pressed");
            keypressed[38] = true;
        }
    });
    
    document.addEventListener("keyup", function(event) {
        if (event.keyCode == 40) {
            console.log("down released");
            keypressed[40] = false;
        } else if (event.keyCode == 38) {
            console.log("up released");
            keypressed[38] = false;
        }
    });


    function balltouchingthecollision(ball)
    {
        if (ball.pos.y + ball.radius >= canva_height)
        {
            ball.velocity.y *= -1;
        }
        if (ball.pos.y + ball.radius - 6 <= 0)
            ball.velocity.y *= -1;
        if (ball.pos.x + ball.radius >= canva_width)
            ball.velocity.x *= -1;
         if (ball.pos.x + ball.radius - 6 <= 0)
            ball.velocity.x *= -1; 
    }
    function protactet_player_baddel(bar)
    {
        if (bar.pos.y + 20 >= canva_height)
            bar.pos.y = canva_height - 20;
        else if (bar.pos.y <= 0)
            bar.pos.y = 0;
    }
    function ball(pos,velocity, radius)
    {
        this.pos = pos;
        this.velocity = velocity;
        this.radius = radius;
        this.update = function()
        {
            this.pos.x += this.velocity.x;
            this.pos.y += this.velocity.y;
        }
        this.draw = function(){
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#ff0000";
            ctx.strokeStyle = "#ff0000";
            ctx.fill();
        }
    }

    function player1(pos, velocity, width, height) {
        this.pos = pos;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.update = function() {
            if (keypressed[40]) {
                console.log("down");
                this.pos.y += this.velocity.y;
            } else if (keypressed[38]) {
                console.log("up");
                this.pos.y -= this.velocity.y; 
            }
            protactet_player_baddel(this);
        }
        this.draw = function()
        {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }
    function player2(pos, velocity, width, height)
    {
        this.pos = pos;
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.update = function()
        {
            this.pos.y = player2_bar;
        }
        this.draw = function()
        {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
    }
    var  player1obj = new player1(vec2(2, player1_bar), vec2(1.5, 1.5), 4, 20);
    var  player2obj = new player2(vec2(canva_width - 6, player2_bar), vec2(0, 0), 4, 20);
    var ballobj = new ball(vec2(ball_x, ball_y), vec2(ballVelocityx, ballVelocityy), 4);
    function gaming_draw()
    {
        player1obj.draw();
        player2obj.draw();
        ballobj.draw();
        protactet_player_baddel(player1obj);
        balltouchingthecollision(ballobj);
    }
    function gaming_update()
    {
        player1obj.update();
        player2obj.update();
        ballobj.update();
    }
    function gaming_event()
    {
        ctx.clearRect(0, 0, canva.width, canva.height);
        window.requestAnimationFrame(gaming_event);
        gaming_draw();
        gaming_update();
        ctx.beginPath();

    }
    gaming_event();
}
draw_anvas_element();