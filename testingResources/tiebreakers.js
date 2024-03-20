// High card
// no tie "Vlad"
[
  'cc=AH,5H,3D,JC,9S/vlad=KC,TD/tanya=QC,2D',
  // tie 1st card 2nd kicker "Tanya"
  'cc=AH,5H,3D,JC,9S/vlad=KC,TD/tanya=KD,QD',
  // tie 4th kicker "vlad"
  'cc=AH,5H,3D,JC,9S/vlad=QC,8D/tanya=QD,4D',
  // TIE
  'cc=AH,5H,TD,JC,9S/vlad=2D,4C/tanya=3D,4D',

  // Pair
  // no tie breaker "vlad"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=8C,2D',
  // highCard "vlad"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=JD,2D',
  // kicker "tanya"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=AD,QD',
  // tie "both"
  'cc=AH,5H,3D,JC,9S/vlad=AC,TD/tanya=AD,TC',

  // Two Pair
  // no tie breaker "vlad"
  'cc=AH,KH,QD,JC,9S/vlad=AC,KD/tanya=8C,2D',
  // first pair "vlad"
  'cc=AH,KH,QD,JC,9S/vlad=AC,KD/tanya=KC,QC',
  // second pair "vlad"
  'cc=AH,KH,QD,JC,9S/vlad=AC,KD/tanya=AD,QC',
  // kicker "tanya"
  'cc=AH,KH,KD,5C,4S/vlad=AC,TS/tanya=AD,QC',
  // tie "both"
  'cc=AH,KH,KD,5C,4S/vlad=AC,TS/tanya=AD,TC',

  // Three of a Kind
  // no tie breaker "vlad"
  'cc=AH,AC,QD,KC,TD/vlad=AD,3C/tanya=QC,KD',
  // high 3 vs low 3 "vlad"
  'cc=AH,5C,QD,KC,TD/vlad=AD,AC/tanya=KH,KD',
  // first kicker "tanya"
  'cc=AH,AC,4D,5C,6D/vlad=AD,7C/tanya=AS,9D',
  // second kicker "vlad"
  'cc=AH,AC,QD,5C,6D/vlad=AD,JC/tanya=AS,TD',
  // tie  "both"
  'cc=AH,AC,QD,5C,6D/vlad=AD,2C/tanya=AS,2D',

  // Straight
  // no tie "Vlad"
  'cc=AH,KH,QD,JC,9S/vlad=TC,TD/tanya=QC,2D',
  // higher straight "tanya"
  'cc=2H,KH,QD,JC,9S/vlad=TC,TD/tanya=AC,TS',
  // tie "both"
  'cc=2H,KH,QD,JC,9S/vlad=TC,TD/tanya=QC,TS',
  // straight on the board "both"
  'cc=TH,KH,QD,JC,9S/vlad=6C,5D/tanya=QC,4S',

  // Flush
  // no tie "vlad"
  'cc=TC,9C,QC,JH,4S/vlad=8C,AC/tanya=AD,AH',
  // higher card flush "vlad"
  'cc=TC,9C,QC,3C,4D/vlad=8D,AC/tanya=KC,2C',
  // same high card, higher kicker flush "vlad"
  'cc=TC,KC,QC,JC,4C/vlad=8D,5C/tanya=9H,2C/vitya=3C,5D',
  // same high card and kickers "tie" 3way
  'cc=9C,KC,QC,JC,AC/vlad=8D,5C/tanya=9H,2C/vitya=3C,5D',

  // Full House
  // no tie
  'cc=AC,AH,KC,KH,QD/vlad=AD,2C/tanya=2S,3H',
  // higher full
  'cc=AC,AH,KC,KH,QD/vlad=AD,2C/tanya=KS,QH',
  // full tie higher kicker "vlad"
  'cc=AC,AH,KC,5H,QD/vlad=AD,KD/tanya=AS,QH',
  // tie same hand
  'cc=AC,AH,KC,5H,QD/vlad=AD,KD/tanya=AS,KS',
  // tie FH on the board
  'cc=AC,AH,KC,KH,AD/vlad=3D,2D/tanya=3S,2S',

  // Four of a kind
  // no tie
  'cc=AC,AH,AS,TH,TD/vlad=AD,2C/tanya=TS,4C',
  // higher 4 "vlad"
  'cc=AC,AH,AS,TH,TD/vlad=AD,2C/tanya=TS,TC',
  // higherKicker "vlad"
  'cc=AS,AH,AC,AD,3D/vlad=KD,JC/tanya=TS,QH',
  // tie same hand on board
  'cc=AC,AH,AS,AD,KD/vlad=2D,3D/tanya=5S,4H',

  // Straight and Royal Flush
  // tie
  'cc=9H,KH,QH,JH,3D/vlad=TH,2D/tanya=8D,TD',
  // higher straight flush
  'cc=9H,TH,QH,JH,3D/vlad=KH,2D/tanya=8H,TD',
  // SF on the board
  'cc=9H,TH,QH,JH,KH/vlad=2H,2D/tanya=8H,TD',
  // royal flush
  'cc=2D,TH,QH,JH,KH/vlad=AH,2C/tanya=9H,TD'
];
