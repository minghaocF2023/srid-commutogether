# Commutogether
## Technology Stack
- Next.js
- Tailwind CSS
- MUI (UI Component Library)
## Style Guide
- [Style Guide (Figma)](https://www.figma.com/design/8cPdqgIfI33twk0i3of7ld/srid-style-guide?node-id=0-1&t=2jhD0sfafFIxf3Mc-1)

## Instructions

### Development env
1. Install Node (brew)
```shell
brew install node@22
```
2. Clone project
```
git clone https://github.com/minghaocF2023/srid-commutogether.git
```
```
cd srid-commutogether
```
3. Install packages
```
npm install --force
```
4. To start DEV server:
```
npm run dev
```
5. The website will be host on ```http://localhost: 3000```

### Production
- [Commutogether](https://srid-commutogether.vercel.app)

## Limitations
- Transportation Preference: Only Caltrain available.
- The bumping interation is not implemented. (We use a button click to simulate the interaction.)
- The scanning interaction is not implemented. (We use a button click to simulate the interaction.)
- No realtime location tracking yet.
- Using localstorage to save data instead of using databases.
- The options in schedule subscription are hardcoded.


