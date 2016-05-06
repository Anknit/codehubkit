<?php
if(isset($_GET['err']))
{
	switch($_GET['err'])
	{
		case '1':
			echo "<h1 style='text-align:center; width:100%'>OOPs The Link seems to be broken</h1>";
			break;
		case '2':
			echo "<h1 style='text-align:center; width:100%'>You are already registered</h1>";
			break;
		case '3':
			echo "<h1 style='text-align:center; width:100%'>First verify your link!!</h1>";
			break;
		case '4':
			echo "<h1 style='text-align:center; width:100%'>Something went wrong!!</h1>";
			break;
		case '5':
			echo "<h1 style='text-align:center; width:100%'>OOPs The link is expired</h1>";
			break;
		default:
			echo "<h1 style='text-align:center; width:100%'>You shouldn't be here</h1>";
			break;
	}
}
else
{
	echo "<h1 style='text-align:center; width:100%'>OOPs The Link seems to be broken</h1>";
}
?>