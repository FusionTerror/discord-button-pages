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

    buttonInteractions: async (button) => {
        if (this.interaction.interactor !== button.clicker.user || Date.now - this.interaction.buttonStartTime >= this.interaction.duration || button.message.id !== this.interaction.msg.id) return;
        if (button.id == 'next-page') {
            (this.interaction.currentPage + 1 == this.interaction.embeds.length ? this.interaction.currentPage = 0 : this.interaction.currentPage += 1);
            this.interaction.msg.edit({ embed: this.interaction.embeds[this.interaction.currentPage], components: [this.interaction.components] });
            button.defer(true);
        } else if (button.id == 'back-page') {
            (this.interaction.currentPage - 1 < 0 ? this.interaction.currentPage = this.interaction.embeds.length - 1 : this.interaction.currentPage -= 1);
            this.interaction.msg.edit({ embed: this.interaction.embeds[this.interaction.currentPage], components: [this.interaction.components] });
            button.defer(true);
        } else if (button.id == 'cancel-page') {
            await this.interaction.msg.delete()
                .catch(err => console.error(err));
        }
    }
};