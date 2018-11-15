/*
 * Create a list that holds all of your cards
 */
/*
 * Global Variables
 */
 	var movesCounter, timerSeconds, timerCycle;
	var previousCard = null, 
    	symbols = ["diamond","paper-plane-o","anchor","bolt","cube","leaf",
	             "bicycle","bomb","diamond","paper-plane-o","anchor",
	             "bolt","cube","leaf","bicycle","bomb"];
	var $mainContainer = $("#content_id"),
		$deck = $('ul.deck'),
		$scorePanel = $('section.score-panel'),
		scorePanelStartHtml = $scorePanel.html();


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/*
 * display the card's symbol
 */
	function showCard(card)
	{
		card.addClass('show open');
		addOpened(card);
	}

/*
 * add the card to a list of open cards
 */
	function addOpened(card)
	{
		if (  previousCard === null )
		{
			previousCard = card;
			return card;
		}

		if ( previousCard.html() == card.html() )
		{
			cardMatch( card, previousCard );
		}
		else 
		{
			cardNoMatch( card, previousCard );
		}

		incrementCounter();
	}

/*
 * lock the cards in the open position
 */
	function cardMatch(card1, card2)
	{
		card1.addClass('match');
		card2.addClass('match');
		previousCard = null;
	}

/*
 * not match, remove the cards from the list and hide
 */
	function cardNoMatch(card1, card2)
	{
		card1.slideToggle(500, function(){
		    card1.toggleClass('open show').show();
		});
		card2.slideToggle(500, function(){
		    card2.toggleClass('open show').show();
		});
	
		previousCard = null;
	}

/*
 * increment the move counter and display it on the page
 */
	function incrementCounter()
	{
		movesCounter ++;
		$('#moves_id').html(movesCounter + " Move(s)");
	}

/*
 * Updates starcount html by remove stars based on clicks
 */
	function updateStarCount()
	{
		if ( previousCard == null )
		{
			if ( movesCounter == 20 || movesCounter == 30 )
			{
				$('ul.stars li').first().remove();
			}
		}				
	}

/*
 * Start timer
 */
	function initTimer()
	{
		timerSeconds += 1;
		$("#timer_id").html( timerSeconds + " second(s)");
		timerCycle = setTimeout( initTimer, 1000);	
	}

/*
 * complete matched, display a message with the final score
 */
	function gameComplete()
	{
		var matched_count = $('ul.deck li.match').length;
		var star_count = $('ul.stars li').length;
		var resultsStr = "";

		if ( matched_count == 16 )
		{
			clearTimeout(timerCycle);
			resultsStr = "Congrats! You just won the game in " + timerSeconds + " seconds with " +
						 star_count + "/3 star rating. Do you want to play again?";

			$('#gameComplete-message').text(resultsStr);
			$('#gameCompleteAlert').modal('show');
		}
	}

/*
 * New-Reset GameBoard
 */
	function newGameBoard()
	{
		var deckShuffled = shuffle(symbols);
		var htmlString = '';

		previousCard = null;
		movesCounter = 0;
		timerSeconds = 0; 
		timerCycle = false;

		for (i = 0; i < deckShuffled.length; i++) {
		  htmlString += '<li class="card"><i class="fa fa-' + deckShuffled[i] +'"></i></li>';
		}

		$deck.html(htmlString);
		$scorePanel.html( scorePanelStartHtml );
	}

/*
 * Click event for card Starts game counter
 */
	$deck.on( "click", ".card", function()
	{
		var $this = $( this );

		if ( $this.hasClass('open') === false ) {
			showCard( $this  );
			updateStarCount();			
			gameComplete();	
		}

		// initialize counter
		if ( timerCycle === false ) {
			initTimer();
		}		
	});

/*
 * Click events for new Game
 */
	$mainContainer.on('click','button.reset-board', function()
	{
		clearTimeout(timerCycle);
		newGameBoard();
		$('#gameCompleteAlert').modal('hide');
	});

	newGameBoard();
