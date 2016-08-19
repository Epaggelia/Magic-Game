/*Assignment 1
Game of Nim

Program the Game of Nim for two-players. Nim is game in which two players take turns
choosing any number of sticks to remove from one of three piles. Each time a player
removes sticks from a pile, the pile gets smaller by that amount. The player to remove
the last stick from the last pile wins.

•	Randomly assign a stick total to each of the three piles. No pile should be empty,
nor is there a specific limit to the number of sticks. That’s up to you.
•	Decide which player goes first randomly.
•	Players must be able to choose which pile to take sticks from and should not be
allowed to take more sticks than available in a pile (or a negative amount), nor take
sticks from empty piles.
•	Between each players’ turn, write the pile totals remaining to the console to keep the
players up-to-date.
•	BONUS: Once a winner is decided, offer the users an option to play again.

HINTS:
You’ll need to use srand() once, and rand() multiple times.
Use a Boolean to track player turns (e.g playerOne == false).
Use a do{}while() loop to contain all the logic (to allow for replay).
Don’t be afraid to nest loops or branching statements.
You’ll need three integer variables for the piles.
*/
#include <iostream>
#include <ctime>
#include <string>

using std::cout;
using std::cin;
using std::endl;
using std::string;
using std::rand;
using std::srand;
using std::time;

int getRandom(int min, int max);

int main()
{
	srand(static_cast<unsigned int>(time(0)));

	int piles[3] = { 0, 0, 0 };
	int pile = 0;
	int amountChoice = 0;
	bool exit = false;
	int continueGame = 0;

	cout << "\tGame of Nim." << endl << endl << endl;
	system("PAUSE");
	system("cls");

	do
	{
		int player = getRandom(0, 100);
		int turn = 0;
		if (player > 50)
		{
			player = 2;
		}
		else {
			player = 1;
		}
		int winner = player;
		
		

		for each (int& var in  piles)
		{
			var = getRandom(30, 60);
		}

		do
		{
			cout << "Player " << winner << "'s turn." << endl;

			do
			{
				cout << "Pick a pile (1-3): ";
				cin >> pile;

				if (pile < 1 || pile > 3)
				{
					cout << "Pick a number in range." << endl << endl;
				}
				if (piles[pile - 1] <= 0)
				{
					cout << "That pile is empty, pick another." << endl;
				}
			} while (pile < 1 || pile > 3 || piles[pile-1] <= 0);

			do
			{
				cout << "Pick a amount (1-" << piles[pile - 1] << "): ";
				cin >> amountChoice;

				if (amountChoice < 1 || amountChoice > piles[pile - 1])
				{
					cout << "Pick a number in range." << endl << endl;
				}
			} while (amountChoice < 1 || amountChoice > piles[pile - 1]);

			piles[pile-1] -= amountChoice;
			cout << piles[pile-1] << endl;

			if (turn % 2 == 1)
			{
				winner = player;
			}
			else {
				if (player == 1)
				{
					winner = 2;
				}
				else {
					winner = 1;
				}
			}
			
			turn += 1;
			
		} while (piles[0] > 0 || piles[1] > 0 || piles[2] > 0);

		//system("cls");

		cout << "The game is over!" << endl;

		cout << "The winner is player " << winner << endl;

		do {
			cout << "Play again?" << endl << "  [0] No." << endl << "  [1] Yes." << endl;
			cin >> continueGame;
			if (continueGame == 0)
			{
				exit = true;
			}
			else
			{
				exit = false;
			}
			system("cls");
		} while (continueGame <0 || continueGame > 1);
	} while (!exit);

	system("PAUSE");
	return 0;
}

int getRandom(int min, int max)
{
	return int(rand() % (max - min) + min - 1);
}







