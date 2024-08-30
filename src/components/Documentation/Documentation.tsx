
const COLORS = ['#003366', '#B0B0B0', '#009688'];

const Documentation = () => {
  const resources = [
    {
      category: 'Videos',
      items: [
        {
          avatar: '/backend.png',
          description: 'Video explicativo del repositorio Backend',
          link: 'https://www.youtube.com/watch?v=46nwDyHP_S4',
          text: 'Backend',
        },
        {
          avatar: '/frontend.png',
          description: 'Video explicativo del repositorio Frontend',
          link: 'https://www.youtube.com/watch?v=n8f6C4JcEy0',
          text: 'Frontend',
        },
        {
          avatar: '/aplicacion.JPG',
          description: 'Video de navegación por la aplicación',
          link: 'https://www.youtube.com/watch?v=FvEca1ey5a0',
          text: 'Aplicación',
        },
      ],
    },
    {
      category: 'Repositorios GitHub',
      items: [
        {
          avatar: '/git-bk.png',
          description: 'Repositorio GitHub del Backend',
          link: 'https://github.com/edcastillob/evaluations-bk.git',
          text: 'GitHub Backend',
        },
        {
          avatar: '/git-fr.png',
          description: 'Repositorio GitHub del Frontend',
          link: 'https://github.com/edcastillob/evaluations-fr.git',
          text: 'GitHub Frontend',
        },
      ],
    },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-md max-w-6xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Documentación de Soporte</h2>
      <div className="space-y-10">
        {resources.map((resourceGroup, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              {resourceGroup.category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {resourceGroup.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={item.avatar}
                    alt={item.text}
                    className="h-12 w-12 rounded-full mb-4"
                    style={{ backgroundColor: COLORS[2] }}
                  />
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-blue-600 hover:text-blue-800 transition duration-300 text-center"
                    title={item.description}
                    style={{ textDecoration: 'none' }}
                  >
                    {item.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documentation;
