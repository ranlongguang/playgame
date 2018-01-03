// JavaScript Document
//地图对象
var Map={
	width:320,
	height:568,
	startElement:$(".start")[0],
	gameContainer:$(".gameContainer")[0]
	};

//自己的战机
var Self={
	width:66,
	height:80,
	x:100,
	y:100,
	imgSrc:"images/self.gif",
	element:null,
	init:function(){//创建页面中使用到的战机	DOM元素，并添加到地图中
		var _img=this.element=document.createElement("img");
		_img.src=this.imgSrc;
		css(_img,{
			width:this.width+"px",
			height:this.height+"px",
			position:"absolute",
			left:this.x+"px",
			top:this.y+"px"
			});
			Map.gameContainer.appendChild(_img);
		},
		move:function(){//战机跟随鼠标移动
			var that=this;
			Map.gameContainer.onmousemove=function(e){
				e=e||event;
				offset(that.element,{
					top:page(e).y-that.height/2,
					left:page(e).x-that.width/2
					});
					that.x=that.element.offsetLeft;
					that.y=that.element.offsetTop;
				}
			}
	};

//子弹、敌机的父类
function Role(options){
	options=options||{};
	this.options=options;
	this.element=null;
	this.width=options.width;
	this.height=options.height;
	this.imgSrc=options.imgSrc;
	this.x=options.x;
	this.y=options.y;
	this.speed=options.speed;
	this.isAlive=true;//当前角色是否还存活
	}
Role.prototype={
	constructor:Role,
	init:function(){//实现角色对应的DOM元素创建
		var _img=this.element=document.createElement("img");
		_img.src=this.imgSrc;
		css(_img,{
			width:this.width+"px",
			height:this.height+"px",
			position:"absolute",
			top:this.y+"px",
			left:this.x+"px"
			});
			//将当前角色添加到游戏地图容器中
			Map.gameContainer.appendChild(_img);
		},
		move:function(){//自动移一步
			//走一步时坐标
			var _top=this.y=this.y+this.speed;
			css(this.element,{
				top:_top+"px"
				});
				//判断是否超出地图容器范围
				if(_top>Map.height||_top<0){
					this.destroy();
					}
			},
			destroy:function(){//释放资源
				this.element.parentNode.removeChild(this.element);
				this.isAlive=false;
			}
	}

//子弹
function Bullet(){
	var options={
		width:6,
		height:14,
		imgSrc:"images/bullet.png",
		x:1,
		y:1,
		speed:-1
		};
		Role.call(this,options);
	}
//继承方法
Bullet.prototype=new Role();


//敌机
function Enemy(options){
	options=options||{};
	Role.call(this,options);
	}
Enemy.prototype=new Role();


//游戏平台对象
var Game={
	bullets:[],//所有子弹
	enemies:[],//所有敌机
	init:function(){
		//初始化战机对象
		Self.init();
		//绑定事件让战机能够跟随鼠标移动
		Self.move();
		},
	startGame:function(){
			var that=this;
			//点击开始界面，启动游戏
			Map.startElement.onclick=function(){
				hide(this);
				that.init();
				that.autoCreate();
				}
			},
	autoCreate:function(){
				var count=0,_score=0;
				setInterval(()=>{
					count++;
					if(count%30==0){
						//创建子弹
						var bullet=new Bullet();
						//子弹产生时的坐标
						bullet.x=Self.x+Self.width/2;
						bullet.y=Self.y-bullet.options.height;
						//子弹初始化
						bullet.init();
						//将当前创建的子弹添加到所有子弹的数组中
						this.bullets.push(bullet);
						}
						//自动创建小敌机
						if(count%90===0){
							var enemy=new Enemy({
								width:34,
								height:24,
								imgSrc:"images/small_fly.png",
								y:1,
								speed:1
								});
								enemy.x=Math.floor(Math.random()*Map.width);
								enemy.init();
								this.enemies.push(enemy);
							}
						if(count%180===0){
							var enemy=new Enemy({
								width:46,
								height:60,
								imgSrc:"images/mid_fly.png",
								y:1,
								speed:1
								});
								enemy.x=Math.floor(Math.random()*Map.width);
								enemy.init();
								this.enemies.push(enemy);
							}
						if(count%270===0){
							var enemy=new Enemy({
								width:110,
								height:164,
								imgSrc:"images/big_fly.png",
								y:1,
								speed:1
								});
								enemy.x=Math.floor(Math.random()*Map.width);
								enemy.init();
								this.enemies.push(enemy);
							}
							//让毎颗子弹向前走一步
							for(var i=this.bullets.length-1;i>=0;i--){
								this.bullets[i].move();
								if(!this.bullets[i].isAlive)
									this.bullets.splice(i,1);
								}
							//让每架敌机向前走一步
							for(var i=this.enemies.length-1;i>=0;i--){
								this.enemies[i].move();
								if(!this.enemies[i].isAlive)
									this.enemies.splice(i,1);
								}
							//碰撞检测
							for(var i=this.bullets.length-1;i>=0;i--){
								var bullet=this .bullets[i];
								for(var j=this.enemies.length-1;j>=0;j--){
									var enemy=this.enemies[j];
									//判断bullent所表示的子弹与enemy所表示的敌机是否碰撞
									if(this.intersect(bullet,enemy)){
										bullet.destroy();
										enemy.destroy();
										this.bullets.splice(i,1);
										this.enemies.splice(j,1);
										if(enemy.width==34)
										_score+=500;
										if(enemy.width==46)
										_score+=1000;
										if(enemy.width==110)
										_score+=5000;
										/*if(_score==1000){
											alert("亲爱的玩家您好：充点小钱¥：100元，成为vip，让你体验前所未有的震撼场面，");
										}
										if(_score==3000){
											alert("亲爱的玩家您好：再充点小钱¥：500，成为白金vip，让子弹变大炮");
										}
										if(_score==5000){
											alert("亲爱的玩家您好：充点小钱¥：1000，成为超级vip，直接变成无敌的存在，相当于开挂，你懂得");
										}
										if(_score==7000){
											alert("充钱了吗？充了并没有效果，哈哈哈哈！好气是不是，是不是想砍死我呀，好了，不打扰你玩游戏了，之后不会再有弹框出现了")
										}
										if(_score==9000){
											alert("你不会真的信了吧，没有弹框，哈哈，怎么可能呢！不过接下来真的不会再有弹框打扰你了，相信我");
										}
										if(_score==11000){
											alert("最后一次弹框");
										}
										if(_score==13000){
											alert("现在真是最后一次弹框了，哪个儿哄你");
										}*/
										$("#score").innerHTML=_score;										
										break;
										}
									}
								}
					},1000/60);
				},
				intersect:function(obj1,obj2){//碰撞检测true：碰撞false：未碰撞
					return !(obj2.y>obj1.y+obj1.height
							||obj1.y>obj2.y+obj2.height
							||obj2.x>obj1.x+obj1.width
							||obj1.x>obj2.x+obj2.width
					);
					}
	};



















































































