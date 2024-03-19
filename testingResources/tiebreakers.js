// Three of a Kind
[
  //     // no tie breaker "vlad"
  'cc=AH,AC,QD,KC,TD/vlad=AD,3C/tanya=QC,KD',
  // high 3 vs low 3 "vlad"
  'cc=AH,5C,QD,KC,TD/vlad=AD,AC/tanya=KH,KD',
  // first kicker "tanya"
  'cc=AH,AC,4D,5C,6D/vlad=AD,7C/tanya=AS,9D',
  // second kicker "vlad"
  'cc=AH,AC,QD,5C,6D/vlad=AD,JC/tanya=AS,TD',
  // tie  "both"
  'cc=AH,AC,QD,5C,6D/vlad=AD,2C/tanya=AS,2D'
];

// Two Pair

[
  // no tie breaker "vlad"
  'cc=AH,KH,QD,JC,9S/vlad=AC,KD/tanya=8C,2D',
  // first pair "vlad"
  'cc=AH,KH,QD,JC,9S/vlad=AC,KD/tanya=KC,QC',
  // second pair "vlad"
  'cc=AH,KH,QD,JC,9S/vlad=AC,KD/tanya=AD,QC',
  // kicker "tanya"
  'cc=AH,KH,KD,5C,4S/vlad=AC,TS/tanya=AD,QC',
  // tie "both"
  'cc=AH,KH,KD,5C,4S/vlad=AC,TS/tanya=AD,TC'
];

// Pair
[
  // no tie breaker "vlad"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=8C,2D',
  // highCard "vlad"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=JD,2D',
  // kicker "tanya"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=AD,QD',
  // tie "both"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=AD,TC'
];

// High card
[
  // no tie "Vlad"
  'cc=AH,5H,3D,JC,9S/vlad=KC,TD/tanya=QC,2D',
  // tie 1st card 2nd kicker "Tanya"
  'cc=AH,5H,3D,JC,9S/vlad=KC,TD/tanya=KD,QD',
  // tie 4th kicker "vlad"
  'cc=AH,5H,3D,JC,9S/vlad=QC,8D/tanya=QD,4D',
  // TIE
  'cc=AH,5H,TD,JC,9S/vlad=2D,4C/tanya=3D,4D'
];
