import os

result = {}

files = [ f for f in os.listdir('.') if f.endswith('.csv') ]
for filename in files:
	f = open(file)
	team = filename.split('.csv')[0]
	result[team] = {}

	for l in f:
		year, ratio = l.split(',')
		ratio = ratio.strip()
		win, loss = ratio.split('/')
		games = win + loss
		float_ratio = float(win) / float(loss)
		result[team][year] = {
		    'win': win,
		    'loss': loss,
		    'ratio': float_ratio,
		    'games': games
		}

print result

fout = open('nba_winrates.csv', 'w')