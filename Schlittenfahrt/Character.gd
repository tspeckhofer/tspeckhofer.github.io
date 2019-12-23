extends RigidBody2D

func _process(delta):
	print(get_colliding_bodies())

func _physics_process(delta):
	# set_transform(get_parent().transform)
	pass
