module.exports = {
    interaction: Object,
    createPages: async (message, embeds, duration, buttonStyle, rightEmoji, leftEmoji, cancelEmoji) => {
        console.log(buttonStyle);
        if (!["red", "green", "blurple"].includes(buttonStyle)) throw new TypeError(`Button style provided is not valid.`);
        if (!rightEmoji) throw new TypeError(`An emoji to go to the next page was not provided.`);
        if (!leftEmoji) throw new TypeError(`An emoji to go to the previous page was not provided.`);
        if (!leftEmoji) throw new TypeError(`An emoji to go cancel the embed page was not provided.`);
        const { MessageButton, MessageActionRow } = require('discord-buttons');
        const nextPageButton = new MessageButton()
            .setLabel("")
            .setStyle(buttonStyle)
            .setEmoji(rightEmoji)
            .setID('next-page');

        const backPageButton = new MessageButton()
            .setLabel("")
            .setStyle(buttonStyle)
            .setEmoji(leftEmoji)
            .setID('back-page');

        const deletePageButton = new MessageButton()
            .setLabel("")
            .setStyle(buttonStyle)
            .setEmoji(cancelEmoji)
            .setID('cancel-page');

        const interactivePages = new MessageActionRow()
            .addComponent(backPageButton)
            .addComponent(deletePageButton)
            .addComponent(nextPageButton);

        const msg = await message.channel.send({ components: [interactivePages], embed: embeds[0] });

        this.interaction.msg = msg;
        this.interaction.embeds = embeds;
        this.interaction.currentPage = 0;
        this.interaction.duration = duration;
        this.interaction.interactor = message.author;
        this.interaction.buttonStartTime = Date.now();
        this.interaction.components = interactivePages;
    },

    buttonInteractions: async (button, interaction) => {
        if (interaction.interactor !== button.clicker.user || Date.now - interaction.buttonStartTime >= interaction.duration || button.message.id !== interaction.msg.id) return;
        if (button.id == 'next-page') {
            (interaction.currentPage + 1 == interaction.embeds.length ? interaction.currentPage = 0 : interaction.currentPage += 1);
            interaction.msg.edit({ embed: interaction.embeds[interaction.currentPage], components: [interaction.components] });
            button.defer(true);
        } else if (button.id == 'back-page') {
            (interaction.currentPage - 1 < 0 ? interaction.currentPage = interaction.embeds.length - 1 : interaction.currentPage -= 1);
            interaction.msg.edit({ embed: this.interaction.embeds[this.interaction.currentPage], components: [interaction.components] });
            button.defer(true);
        } else if (button.id == 'cancel-page') {
            await interaction.msg.delete()
                .catch(err => console.error(err));
        }
    }
};