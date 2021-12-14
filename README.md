# Antho parle web - Christmas XP

![APW for Three.js](apw.png)

## Pitch
Pour ce dernier contest de l'année 2021, je souhaite faire honneur à un événement qui eu lieu pendant de plusieurs années et qui m'a marqué à mes débuts : les Christmas experiments.
Organisé par David RONAI ([@makio64](https://twitter.com/makio64)), cet événement avait pour but de réunir plusieurs développeurs afin de créer un "calendrier de l'avant du web créatif". Ainsi, nous découvrions une réalisation par jour durant la période de l'Avant.
## Objectif
- Mise en place d'une expérience créative et interactive sur la thématique de Noël
- Aucune contrainte technique dès lors qu'il s'agit de techno web
- L'expérience peut être 2D (ex: portfolio du Père Noël, refonte de la homepage du Santa Claus Village, etc) ou 3D
- Obligation de mettre en place et présenter un moodboard et un petit texte résumé en appui afin d'expliquer sa démarche créative (texte + url du board dans votre README : Pinterest, Miro, Figma, Google Slide... à votre convenance)

## Livrable
- README avec un texte explicatif et le lien public de votre moodboard
- Code à push sur le repo dans votre branche 'ft-pseudo'
- URL de prod
- Préférable mais non obligatoire : mise en place d'une maquette graphique (URL à indiquer dans le README)

## Date de livraison
14 Décembre 2021 / 18h00 (heure FR)

## Inspiration et crédits

- https://christmasexperiments.com/
- https://christmasexperiments.com/archive/



## Explication de la démarche

### Le concept 
Noël, c'est l'occasion d'offrir des cadeaux aux personnes qui nous sont proches.

Et si on offrait un cadeau unique à chaque personne ?

Ici, le concept est de créer un graphique unique basé sur le prénom de la personne. Et comme c'est Noël, on va faire un flocon de neige généré par algorithme.

### La méthode

Il nous faut obtenir des variables à partir d'une chaîne de caractères de longueur variable. On ne peut donc pas prendre la valeur de chaque caractère (car nous aurions autant de paramètres que de caractère... alors que nous préfèrerions avoir un nombre de paramètres fixes)

Pour résoudre ce problème, on utilise la fonction de hashage CRC32 qui nous fourni systématiquement 8 octets, chaque octet allant de 0x0 à 0xF (0 à 15).

Nous avons donc 8 paramètres utilisables pour générer notre flocon !

Ces paramètres permettent ensuite de générer des angles, des longueurs ou des nombres de "pics".

### Le résultat

Le flocon est généré dans un Canvas avec le framework canvas-sketch.

Tout le code a été réalisé en Typescript car j'aime souffrir et créer des interfaces.

Lorsqu'un prénom est tapé, le flocon se dessine instantanément. Il est possible de partager la page avec le flocon dessiné (l'url change dynamiquement), un beau moyen d'offrir un flocon à quelqu'un 😃

ex: https://syltech.fr/snowflake/?name=Antho_parle_web

Pour accéder au mode debug, il suffit de se connecter avec la query param ?debug

ex: https://syltech.fr/snowflake/?debug

### Retour d'expérience

Ce Creative Contest m'aura permis :
- d'utiliser Snowpack pour packager le code
- de faire mon projet le plus complexe dans un contexte 2D
- de réviser ma trigonométrie 📐
- d'offrir plein de flocons à mes proches

## Moodboard 

https://docs.google.com/presentation/d/1i322fZtb5SAN2xVVrxwcTvz0VOnJ8qEGxVYqh2tsO1U/edit?usp=sharing


## Commandes

Lancer en local : 

```
npm run start
```


Compiler :

```
npm run build
```

Il est possible qu'un message d'erreur apparaisse, relancer la commande de build une seconde fois (à corriger !!!!)