const { Client, GatewayIntentBits, MessageActionRow, MessageButton } = require('discord.js');
const {token} = require('./config.json')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.MessageContent,
  ],
});

const prefix = '/'; // Command prefix

const quizQuestions = [
  {
    type: 'multiple',
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    type: 'truefalse',
    question: 'Is the Earth flat?',
    correctAnswer: 'false',
  },
  {
    type: 'shortanswer',
    question: 'What is the largest ocean on Earth?',
    correctAnswer: 'Pacific',
  },
];

const leaderboard = new Map(); // Store user scores

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'startquiz') {
    startQuiz(message);
  } else if (command === 'leaderboard') {
    displayLeaderboard(message);
  }
});

function startQuiz(message) {
  leaderboard.clear(); // Clear previous scores
  sendQuestion(message);
}

function sendQuestion(message) {
  const currentQuestion = quizQuestions[leaderboard.size];

  if (currentQuestion) {
    const questionEmbed = createQuestionEmbed(currentQuestion);
    const row = createButtonsRow(currentQuestion);
    message.channel.send({ embeds: [questionEmbed], components: [row] })
      .then((sentMessage) => {
        const filter = (interaction) => interaction.customId === 'answerButton';
        const collector = sentMessage.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', (interaction) => {
          collector.stop();
          answerQuestion(message.author.id, interaction.customId);
          sendQuestion(message);
        });

        collector.on('end', () => {
          sentMessage.edit({ components: [] }); // Remove buttons after the collector ends
        });
      });
  } else {
    message.channel.send('The quiz has ended. You can start a new quiz with /startquiz.');
  }
}

function createQuestionEmbed(question) {
  const questionEmbed = {
    title: 'Quiz Question',
    description: question.question,
    color: '#3498db',
  };

  if (question.type === 'multiple') {
    questionEmbed.fields = [
      { name: 'Options', value: question.options.join('\n') },
    ];
  }

  return questionEmbed;
}

function createButtonsRow(question) {
  const options = question.options || ['True', 'False']; // Default options for true/false
  const row = new MessageActionRow()
    .addComponents(
      options.map((option, index) => new MessageButton()
        .setCustomId(`answerButton${index + 1}`)
        .setLabel(option)
        .setStyle('PRIMARY')),
    );
  return row;
}

function answerQuestion(userId, selectedOption) {
  const currentQuestion = quizQuestions[leaderboard.size];

  if (!currentQuestion) {
    return;
  }

  const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer) + 1;
  const selectedOptionIndex = parseInt(selectedOption.replace('answerButton', ''), 10);

  if (selectedOptionIndex === correctOptionIndex) {
    updateScore(userId, true);
  } else {
    updateScore(userId, false);
  }
}

function updateScore(userId, isCorrect) {
  const score = leaderboard.get(userId) || 0;
  leaderboard.set(userId, isCorrect ? score + 1 : score);
}

function displayLeaderboard(message) {
  if (leaderboard.size === 0) {
    message.channel.send('No scores to display. Start a quiz with /startquiz.');
    return;
  }

  const sortedLeaderboard = [...leaderboard.entries()].sort((a, b) => b[1] - a[1]);

  const leaderboardEmbed = {
    title: 'Leaderboard',
    color: '#3498db',
    fields: sortedLeaderboard.map(([userId, score], index) => ({
      name: `#${index + 1} ${client.users.cache.get(userId).username}`,
      value: `Score: ${score}`,
    })),
  };

  message.channel.send({ embeds: [leaderboardEmbed] });
}


client.login(token);
