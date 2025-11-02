export type Zone = {
  id: string;
  name: string;
  coords: [number, number][];
  avcd: number;
  cmsr: number;
  population: number;
  evacuationRoutes?: [number, number][][];
  meetingPoints?: {
    id: string;
    name: string;
    coord: [number, number];
    description?: string;
  }[];
};

// Coordenadas aproximadas (lat, lon) for demo only
const zones: Zone[] = [
  {
    id: "la-maria",
    name: "La María",
    coords: [
      [4.586, -74.225],
      [4.58, -74.215],
      [4.587, -74.205],
      [4.593, -74.212],
    ],
    avcd: 78,
    cmsr: 45,
    population: 4200,
    // rutas de evacuación de ejemplo (listas de coordenadas)
    evacuationRoutes: [
      [
        [4.587, -74.223],
        [4.585, -74.216],
        [4.59, -74.208],
      ],
      [
        [4.589, -74.22],
        [4.592, -74.212],
      ],
    ],
    meetingPoints: [
      {
        id: "lm-p1",
        name: "Punto de encuentro 1",
        coord: [4.589, -74.219],
        description: "Parque central",
      },
      {
        id: "lm-p2",
        name: "Punto de encuentro 2",
        coord: [4.591, -74.21],
        description: "Iglesia principal",
      },
    ],
  },
  {
    id: "el-danubio",
    name: "El Danubio",
    coords: [
      [4.595, -74.198],
      [4.588, -74.19],
      [4.58, -74.195],
      [4.586, -74.205],
    ],
    avcd: 66,
    cmsr: 55,
    population: 3800,
    // sin rutas de evacuación de ejemplo
    meetingPoints: [
      {
        id: "ed-p1",
        name: "Punto de encuentro A",
        coord: [4.5895, -74.197],
        description: "Cancha comunal",
      },
    ],
  },
];

export default zones;
