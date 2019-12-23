extends Node

const H = 1000 # width of a part of a hill.
const V = 200 # average vertical offset per hill part.
const HILLSIZE = 3000 # vertical size of the hill
const VARIATION = 500 # vertical variation of the control points.
const LINES = 10.0 # horizontal length of the line segments that form the curved hills.

var step = 0
var y1 = 0.0
var d1 = 0.0

# Called when the node enters the scene tree for the first time.
func _ready():
	step = 0
	y1 = 0.0
	d1 = 0.0
	for i in range(5):
		add_hill()

func _process(delta):
	if $Player.position[0] > (step - 3.0) * H:
		add_hill()

func add_hill():
	var rng = RandomNumberGenerator.new()
	rng.randomize()
	var y2 = rng.randf_range((step+1)*V - VARIATION, (step+1)*V + VARIATION)
	var d2 = rng.randf_range(-1.0, 1.0)
	var values = [[0, y1, d1], [H, y2, d2]]
	var coeffs = hermite_coeffs(values)
	var hill_points = PoolVector2Array()
	hill_points.append(Vector2(step*H, step*H + HILLSIZE))
	for i in range(ceil(H/LINES) + 1):
		hill_points.append(Vector2(H*step + i*LINES, hermite_eval(values, coeffs, i*LINES)))
	hill_points.append(Vector2((step + 1)*H, (step + 1)*H + HILLSIZE))
	var new_polygon = $Polygon.duplicate()
	new_polygon.polygon = hill_points
	add_child(new_polygon)
	var new_hill_collision_polygon = $HillCollisionPolygon.duplicate()
	new_hill_collision_polygon.polygon = hill_points
	add_child(new_hill_collision_polygon)
	y1 = y2
	d1 = d2
	step += 1

func hermite_coeffs(values):  # Calculates the Hermite interpolation coefficients of the interpolation polynomial P
	# defined by P^(k)(x_i) = y_i^(k), k = 0,...,n_i-1, i = 0,...,m and deg(P) <= sum_(i=0)^m n_i - 1.
	# Input: values = [[x_0,y_0^(0),...,y_0^(n_0-1)], ..., [x_m,y_m^(0),...,y_m^(n_m-1)]], where x_i are pw. distinct.
	var m = len(values)
	var n_i = []
	for elem in values:
		n_i.append(len(elem) - 1)
	var n = -1
	for i in range(len(n_i)):
		n += n_i[i]
	var x = []
	var f = []
	for i in range(m):
		for k in range(n_i[i]):
			x.append(float(values[i][0]))
			f.append(float(values[i][1]))
	for k in range(1, n + 1):
		for i in range(n, k - 1, -1):
			if x[i] != x[i - k]:
				f[i] = (f[i] - f[i - 1]) / (x[i] - x[i - k])
			else:
				var r = 0
				var pos = i - k
				var sum_n_i = 0
				for j in range(m):
					sum_n_i += n_i[j]
					if pos < sum_n_i:
						break
					r += 1
				var k_factorial = 1
				for i in range(1, k+1):
					k_factorial *= i
				f[i] = values[r][k + 1] / k_factorial
	return f

func hermite_eval(values, coeffs, x0):  # Calculates the Hermite interpolation polynomial value at x0.
	var m = len(values)
	var n_i = []
	for elem in values:
		n_i.append(len(elem) - 1)
	var n = -1
	for i in range(len(n_i)):
		n += n_i[i]
	var x = []
	for i in range(m):
		for k in range(n_i[i]):
			x.append(values[i][0])
	var p = coeffs[0]
	var w = 1
	for i in range(1, n + 1):
		w *= x0 - x[i - 1]
		p += coeffs[i] * w
	return p
