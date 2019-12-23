extends RigidBody2D

const TORQUE = 15000.0
const SPEED = 1000.0
var gameover = false

func _physics_process(delta):
	if $Character.get_colliding_bodies().size() > 0:
		gameover = true
	if gameover == true:
		return	
	if Input.is_action_pressed('ui_right') and Input.is_action_pressed('ui_left'):
		set_applied_torque(0.0)
	elif Input.is_action_pressed('ui_right'):
		set_applied_torque(TORQUE)
	elif Input.is_action_pressed('ui_left'):
		set_applied_torque(-TORQUE)
	else:
		set_applied_torque(0.0)
		
	if get_colliding_bodies().size() > 0:
		if Input.is_action_pressed('ui_up') and Input.is_action_pressed('ui_down'):
			pass
		elif Input.is_action_pressed('ui_up'):
			set_linear_velocity(linear_velocity - SPEED * delta * transform.y)
		elif Input.is_action_pressed('ui_down'):
			set_linear_velocity(linear_velocity + SPEED * delta * transform.y)
