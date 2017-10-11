<?php
# Put a valid docblock here!
function getEquilibriums($arr) {
	$output = array();
	# Logic goes here!
    $sum = 0;      //sum of whole array initialized
    $leftsum = 0; // initialize leftsum 
    $n=sizeof($arr);
 
 /* Find sum of the whole array */
   for ($i = 0; $i < $n; $i++)
        $sum += $arr[$i];
 
   for( $i = 0; $i < $n; $i++)
   {
      $sum -= $arr[$i]; // sum is now right sum for index i
 
      if($leftsum == $sum) //we have found a match now push to output array.
        $output[]=$i; 
 
      $leftsum += $arr[$i]; //prepare for next iteration
   }
 
    /* Check size of output array for equiliibrium index results and return result array, else no indexes found, then return -1 */
    if (sizeof($output)>0){
        return $output;
        
    }else{
        return -1;
    }

	#end logic
}

#here is my Test sorry sandbox doesn't include phpUnit
		$arr = array(-7, 1, 5, 2, -4, 3, 0);
		if (array(3,6) == getEquilibriums($arr)){
		echo "Yes, assertEquals passed PHPunit";
		}else{
		    echo "No equilibrium indexes found";
		}

