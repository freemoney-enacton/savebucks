<x-filament-panels::page>

    <x-filament::section>
        <x-slot name="heading">
            {{__("Basic Info")}}
        </x-slot>

        <x-filament-panels::form wire:submit="basicFormSave">
            {{ $this->editBasicForm }}

            <x-filament-panels::form.actions
                :actions="$this->editBasicFormAction()"
                :full-width="$this->hasFullWidthFormActions()"
            />
        </x-filament-panels::form>
    </x-filament::section>

    <x-filament::section>
        <x-slot name="heading">
            {{__("Change Password")}}
        </x-slot>

        <x-filament-panels::form wire:submit="passwordFormSave">
            {{ $this->editPasswordForm }}

            <x-filament-panels::form.actions
                :actions="$this->editPasswordFormAction()"
                :full-width="$this->hasFullWidthFormActions()"
            />
        </x-filament-panels::form>
    </x-filament::section>

    <x-filament-actions::modals />

</x-filament-panels::page>
