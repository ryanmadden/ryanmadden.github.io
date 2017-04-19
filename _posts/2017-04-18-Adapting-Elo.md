---
layout: mathpost
title: Adapting Elo for Relative Player Ranking in Team-Based Games
---

_In the early-to-mid 2010s a drinking game called Caps gained prominence at Northwestern University. This post is a result of my efforts to quantitatively identify elite Caps players as part of an iOS app called SplashTrack._

**Meet Elo**

The Elo rating system is an algorithm for describing the relative skill of game players. If you’ve ever played competitive chess then you’ve seen this before. Let’s say that Player A has a rating of 900 and Player B has a rating of 800. The ‘expected result’ (E<sub>A</sub> or the probability of Player A winning the game) is expressed like this:

$$
\begin{align}
E_A & = \frac{1}{1+10^{(R_B-R_A)/400}} \\
& = \frac{1}{1+10^{(800-900)/400}} \\
& \approx0.64 \\
\end{align}
$$

In this case, the probability of Player A winning the game is $VALUE. At the end of the game, the ‘actual result’ (S<sub>A</sub>) for Player A will be 1 for a win, 0 for a loss, or 0.5 for a tie. The difference between the actual result and the expected result is combined with a scaling factor ‘K’ to calculate the new rating for each player. The formula for that calculation look like this:

$$
R'_A=R_A+K(S_A-E_A)
$$

Let’s assume a K-Value of 20. If Player A wins in our example, each player’s rating will be adjusted as follows: 

$$
\begin{align}
R'_A & = R_A+K(S_A-E_A) \\
& = 900+20(1-0.64) \\
& \approx 907 \\
\\  
R'_B & = R_B+K(S_B-E_B) \\
& = 800+20(0-0.36) \\
& \approx 793 \\
\end{align}
$$

Player A’s rating rises 7 points to 907 while Player B’s rating falls 7 points to 793. This makes sense; if you win a game your rating should always go up (at least a little bit) and if you lose a game your rating should always go down.

The Elo algorithm also takes relative skill into account when adjusting players’ ratings after a game. In our example, when Player A won her rating increased 7 points. However, if Player A had lost that game to Player B her rating would have fallen to:

$$
\begin{align}
R'_A & = R_A+K(S_A-E_A) \\
& = 900+20(0-0.64) \\
& \approx 887 \\
\end{align}
$$

for a delta of 13 points. This makes sense.  An underdog should be rewarded with more points for winning when they are expected to lose while a strong favorite shouldn’t receive much of a reward for crushing players much worse than they are.

**Ranking in Team-Based Games**

Imagine a simple game based around shooting free throws on a basketball court. In this game, teams of two face off to see which team can be the first to make ten free throws. All four players alternate shooting until one team’s combined baskets reaches ten. 

If we wanted to rank players in this game to determine who was the best, accuracy would be the most relevant statistic. Since this game is purely accuracy-based, your value as a teammate is directly proportional to your shooting percentage. But what if we didn’t have accuracy data for the players? After all, recording every shot is tedious and interrupts the flow of gameplay. Is it possible to rank players while only knowing the results of each game?

Enter, Elo. We can use the Elo algorithm to relatively rank players in the basketball game just like we did in the above example. One solution is to simply combine each team’s constituent ratings to create a ‘team rating’ and run the algorithm with this value.

For example, imagine that one team has two players, each with a rating of 800. If the players on the opposing team also have ratings of 800 then this is a completely even game. Both teams’ ratings sum to 1600 and each team has (according to Elo) a 50% chance to win the game. This would also be true if a team had two players with ratings 700 and 900 respectively. On average, we would expect them to perform just as well together as two players with rating 800.

When a game ends, the winning team’s ratings go up and the losing team’s ratings go down in accordance with the Elo formula. 

But wait! This rating system isn’t totally fair. Let’s imagine a particular game where all four players have rating 800. On Team 1 we have Player A and Player B. Throughout the game, Player A makes nine free throws and Player B makes one. They’re the first team to ten total free throws and they win! But after, both of their ratings go up by the same amount. 

This doesn’t make sense. Player A was the best player in the game and deserves to be fairly rewarded, while Player B may well have been the worst player in the game (with players on the other team potentially having four free throws each).

It would even be possible for an individual player to make nine free throws and still lose the game, causing their rating to decrease. This is even more absurd when you realize that the players on the other team may have simply made five free throws each. So even with a dominant performance a player’s rating may still decrease if their partner underperforms!

We can do better.

**Rewarding Performance Over Wins**

As reasoned above, the best players in this game are the ones with the highest accuracy, or the ones who make the most free throws. By combining players’ ratings to form a ‘team rating’ and evaluating players on the overall result of the game, we unfairly punish over-performing players and unfairly reward weak players with strong partners.

Instead of using the result of the game (a win or a loss for each team) as the metric of success, we should evaluate each pair of players on the number of shots that they have made. As far as the rating system is concerned, every game is effectively six individual matchups: one for every unique pair of two players in the game. 

Imagine a particular game goes as follows:

| Player        | Rating | Shots Made |
| ------------- |:------:| ----------:|
| Player A      | 1000   | 5          |
| Player B      | 600    | 2          |
| Player C      | 650    | 3          |
| Player D      | 900    | 6          |

When the game is over, Player A’s rating will be affected by their performance relative to Player B, Player C, and Player D. Using each player’s current rating (and score total to determine a win or loss), Elo can provide us with three rating deltas for Player A. The computation is as follows:

$$
\begin{align}
R'_A = R_A & + K(S_{AB} - E_{AB}) \\
& + K(S_{AC}-E_{AC}) \\
& + K(S_{AD}-E_{AD}) \\
\end{align}
$$

$$
\begin{align}
R'_A = 1000& + 20(1-0.91) \\
& + 20(1-0.88) \\
& + 20(0-0.64) \\
\end{align}
$$

$$
R'_A \approx 991
$$

Player A’s initial rating was 1000. After applying the result of the matchups with Player B, Player C, and Player D, her rating will be 991. Since Player A was heavily favored against Player B and Player C, her ‘win’ against each of them is not enough to compensate for the ‘loss’ to Player D.

After a game, every player’s rating can be adjusted in this fashion based on their pairwise results against every other player. Cool! Now we have a rating system that rewards high performers, even if their partners cause them to ultimately lose the game. This seems fair and robust.

There’s one more small improvement we can make. We’re currently using each player’s number of free throws made to determine whether each pairwise result is a win or a loss. If Player A makes four free throws and Player B makes two, Player A wins their ‘matchup’ in the eyes of the algorithm. But this is also true if Player A makes nine and Player B makes two. Shouldn’t we reward players – at least a little – for more dominant performances?

**Margin of Victory Multiplier**

As a quick refresher, the Elo algorithm looks like this:

$$
R'_A=R_A+K(S_A-\frac{1}{1+10^{(R_B-R_A)/400}})
$$

We’d like to somehow incorporate the margin of victory to reward players who make significantly more free throws than the other players in the game. There are a couple ways to do this that mostly vary in how you weight margin of victory to affect the change in each player’s rating.

I’m no statistician, but thankfully there are some who have thought this through. Nate Silver wrote an article in 2014 where he talked about using the Elo algorithm to rank NFL teams. In it, he detailed a Margin of Victory Multiplier (MoVM) that looks like this:

$$
Q = \frac{2.2}{(ELOW - ELOL) * 0.001 + 2.2}
\\
MoVM = ln(Abs(PD)+1) * Q
$$

In this formula PD is the difference in the two players’ scores. ELOW is the rating of the winning team and ELOL is the rating of the losing team. The MoVM is used as a scalar multiplier in the Elo formula like so:

$$
R'_A=R_A+K(S_A-E_A)*MoVM
$$

The effect of this new formula can be seen in sample matchups below:

| R<sub>A</sub> | R<sub>B</sub>  | Pts<sub>A</sub> | Pts<sub>B</sub> | E<sub>A</sub> | S<sub>A</sub> | MoVM | R'<sub>A</sub> |
| ------------: | -------------: | --------------: | --------------: | ------------: | ------------: | ---: | -------------: |
| 900           | 800            | 6               | 3               | 0.64          | 1             | 1.33 | 910            |
| 800           | 900            | 6               | 3               | 0.35          | 1             | 1.45 | 919            |
| 700           | 700            | 9               | 2               | 0.50          | 1             | 2.08 | 720            |
| 900           | 700            | 4               | 7               | 0.76          | 0             | 1.52 | 877            |


**Conclusion**

Given an accuracy-based game played by multiple players, we can rank the relative skill of the players using an adapted version of the Elo algorithm. After a game, each possible pairing of players is evaluated individually and the net rating changes of each pair matchup are applied to each player’s rating. The rating change for a given pair matchup is scaled by the Margin of Victory Multiplier which is a function of the difference between the two players’ scores. This approach scales fairly well to games of arbitrary size (or team size), with the parameter K being used to tune for the volatility of the ratings.

And there we have it! The Elo algorithm was designed to rank players in one-on-one contests with simple binary results (i.e. chess with only wins, losses, and ties). But with a little work we can expand its reach to include accuracy-based games with multiple players, incorporating in-game performance along the way. What fun! Now go outside.

