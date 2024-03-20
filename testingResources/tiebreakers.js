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

// Straight
[
  // no tie "Vlad"
  'cc=AH,KH,QD,JC,9S/vlad=TC,TD/tanya=QC,2D',
  // higher straight "tanya"
  'cc=2H,KH,QD,JC,9S/vlad=TC,TD/tanya=AC,TS',
  // tie "both"
  'cc=2H,KH,QD,JC,9S/vlad=TC,TD/tanya=QC,TS',
  // straigh on the board "both"
  'cc=TH,KH,QD,JC,9S/vlad=6C,5D/tanya=QC,4S'
];

// Flush
[
  // no tie "vlad"
  'cc=TC,9C,QC,JH,4S/vlad=8C,AC/tanya=AD,AH',
  // higher card flush "vlad"
  'cc=TC,9C,QC,JC,4D/vlad=8D,AC/tanya=KC,2C',
  // same high card ,higher kicker flush "vlad"
  'cc=TC,KC,QC,JC,4C/vlad=8D,5C/tanya=9H,2C/vitya=3C,5D',
  // same high card and kickers "tie" 3way
  'cc=9C,KC,QC,JC,AC/vlad=8D,5C/tanya=9H,2C/vitya=3C,5D'
];
