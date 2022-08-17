1.  Plan jest taki by stworzyc div w ktorym zawsze beda wyswietlaly sie posty zalezne od tego jaki jest state queryset.
    Ten stan bedzie zmieniany za kazdym razem gdy klikniemy w cos innego, czyli event listener bedzie fetchowal dane dla danego
    linku tym samym zmieniajac dataset. Musze to przetestowac.
2.  Klikajac fetchujemy dane, nastepnie zapisujemy querySet, potem wysylamy ten queryset do paginacji. Paginacja zwraca nam wycinek danych i 
    liczbe stron. Nastepnie wywolujemy funkcje do budowanai postow ktora wezmie obecny stan querySet. Chyba ze w funkcji budowania posta bierzemy
    obecny queryset, a nastepnie przekazujemy go do paginacji ktora zwraca liczbe stron i wycinek.
3.  Klikajac na dany navbar zmieniany jest querySet. Sprawdzone. Teraz trzeba ogarnac ta funkcje do budowania postow.
4.  Dobra dziala. Posty wyswietlaja sie. Teraz trzeba ogarnac przyciski.
5.  Wszystko dziala. Funkcja do budowania postow po skonczeniu petli dla listy postow, buduje przyciski wykorzystujac dane o stronach otrzymanych na poczatku
    z paginacji. Mialem problem bo tak jakby state strony sie zapisywal i jak bylem na 5 stronei network i kliknalem w following to brana byla pod uwage ta 5
    strona ktora sie zapisala dlatego dodalem do kazdego klikniecia zeby ustawic strone = 1, dzieki temu za kazdym razem pojawia sie pierwsza strona.
6.  Teraz trzeba dokonczyc implementacje postow oraz stworzenie profilu.