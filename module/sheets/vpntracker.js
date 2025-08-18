export default class cbrVpnTracker extends foundry.appv1.sheets.ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 500,
            height: 400,
        });
    }

    get template() {
        return `systems/CBRPNK/templates/sheets/${this.actor.type}.hbs`;
    }

    getData() {
        const context = super.getData();
        context.system = context.actor.system;
        context.system.netscape = game.settings.get("CBRPNK", "netscapeModule");
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.mousedown(this._vpnTrackerClick.bind(this));
    }

    _vpnTrackerClick(event) {
        if (!event.target.closest('.vpn-track')) return;
        
        const btnClick = 
            (event.which === 1 || event.button === 0) ? "l" :
            (event.which === 2 || event.button === 1) ? "m" :
            (event.which === 3 || event.button === 2) ? "r" : null;
        
        const currentValue = this.actor.system.value;
        const maxValue = this.actor.system.max;
        let newValue = currentValue;
        
        switch (btnClick) {
            case "l":
                newValue = Math.min(currentValue + 1, maxValue);
                break;
            case "r":
                newValue = Math.max(currentValue - 1, 0);
                break;
            default:
                return;
        }
        
        // Determine status based on value
        let status = "safe";
        if (newValue === maxValue) {
            status = "blown";
        } else if (newValue > 0) {
            status = "warning";
        }
        
        this.actor.update({ 
            "system.value": newValue,
            "system.status": status
        });
    }
}