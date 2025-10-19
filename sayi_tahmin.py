import random

print("Tahmin oyununu 1 ile istediginiz sayi araliginda oynayabilirsiniz. Örnek: 1-100\n ")
while True:
    try:
        istenen_aralik = int(input("1 ile kac araliginda tahmin oyunu oynayalim?: "))
        break
    except ValueError:
        print("Lütfen sadece tam sayi girin")

tahmin_araligi = istenen_aralik
pc_sayi = random.randint(1, tahmin_araligi)

while True:
    try:
        oyuncunun_sayisi = int(input("Lütfen bir sayi tutun: "))
        if 0 < oyuncunun_sayisi <= istenen_aralik:
            break
        else:
            print("Tuttugunuz sayi 1-", istenen_aralik, "arasinda olmali\n")
    except ValueError:
        print("Sectiginiz sayi belirttiginiz aralikta ve bir tam sayi olmalidir")

pc_sececegi_sayilar = list(range(1, tahmin_araligi+1))

pc_tahmin_liste = []
tahmin_liste = []

pc_tahmin_sayisi = 0
tahmin_sayisi = 0

pc_puan = 100
puan = 100

print("Oyundan cikmak icin 0 basin\n")

while True:
    if not pc_sececegi_sayilar:  # Liste boşsa oyun durur
        break

    pc_secilen_sayi = random.choice(pc_sececegi_sayilar)
    pc_tahmin_liste.append(pc_secilen_sayi)
    pc_sececegi_sayilar.remove(pc_secilen_sayi)

    print("- Benim tahminim", pc_secilen_sayi,
          "oldu" + (", sira sizde\n" if pc_secilen_sayi != oyuncunun_sayisi else ""))

    if pc_secilen_sayi == oyuncunun_sayisi:
        print("ve Kazandim!\n")
        pc_tahmin_sayisi += 1
        puan = 0  # sadece oyuncunun puanı sıfırlanıyor
        break
    pc_tahmin_sayisi += 1
    pc_puan -= 5

    while True:
        try:
            oyuncu_tahmin = int(input("Tahmininiz: "))
            tahmin_sayisi += 1

            if not (0 <= oyuncu_tahmin <= tahmin_araligi):
                print("Lütfen 1 -", istenen_aralik, "arasinda bir sayi girin")
                continue
            else:
                break

        except ValueError:
            print("Sectiginiz sayi bir tam sayi olmalidir!")

    if oyuncu_tahmin == 0:
        print("Oyundan cikildi\n")
        break

    if oyuncu_tahmin == pc_sayi:
        print("Kazandiniz! Tebrikler! Dogru tahmin.\n")
        tahmin_liste.append(oyuncu_tahmin)
        pc_puan = 0  # sadece bilgisayarin puanı sıfırlanıyor
        break

    if oyuncu_tahmin in tahmin_liste:
        print("Bu sayiyi zaten girdiniz.")

    else:
        tahmin_liste.append(oyuncu_tahmin)
        puan -= 5
        if oyuncu_tahmin > pc_sayi:
            print(f"Bir dahaki sefer {oyuncu_tahmin}'den daha kücük bir sayi tahmin edin\n")
        else:
            print(f"Bir dahaki sefer {oyuncu_tahmin}'den daha büyük bir sayi tahmin edin\n")

print("Yaptığım tahminler: ", ", ".join(str(sayi) for sayi in pc_tahmin_liste))
print("Yaptığım tahmin sayisi:", pc_tahmin_sayisi)
print("Puanim:", pc_puan, "\n")
print("Yaptiginiz tahminler: ", ", ".join(str(sayi) for sayi in tahmin_liste))
print("Yaptığınız tahmin sayisi: ", tahmin_sayisi)
print("Puaniniz:", puan)
