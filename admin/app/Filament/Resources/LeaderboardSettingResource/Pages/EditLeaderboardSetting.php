<?php

namespace App\Filament\Resources\LeaderboardSettingResource\Pages;

use App\Filament\Resources\LeaderboardSettingResource;
use App\Models\LeaderboardRun;
use Filament\Actions;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Http;

class EditLeaderboardSetting extends EditRecord
{
    use EditRecord\Concerns\Translatable;
    protected static string $resource = LeaderboardSettingResource::class;


    //n

//     public bool $isDataLoaded = false;
    
//     // Add this lifecycle hook
//    // This signature must match the parent class
//         public function mount(string|int $record): void
//         {
//             parent::mount($record);
            
//             // Set isDataLoaded to true after a small delay to ensure relationship data is loaded
//             $this->dispatch('checkDataLoaded');
//         }
//     // Initialize your listeners
//     protected function getListeners(): array
//     {
//         return [
//             'checkDataLoaded' => 'markDataAsLoaded',
//         ];
//     }
    
//     // A method to mark data as loaded
//     public function markDataAsLoaded(): void
//     {
//         // You could add additional checks here if needed
//         $this->isDataLoaded = true;
//     }
    //n end

    protected function getHeaderActions(): array
    {
        return [
            // Actions\DeleteAction::make(),
            Actions\LocaleSwitcher::make(),
            // Action::make('start_leaderboard')
            //     ->action(function() {
            //         $leaderboadCode = $this->getRecord()->code;

            //         $leaderboardStartUrl = config('app.api_url') . '/api/v1/leaderboards/initialize/' . $leaderboadCode;

            //         $res = Http::withHeaders([
            //             'token' => config('app.api_admin_token')
            //         ])->get($leaderboardStartUrl);

            //         $leaderboardRecalculateUrl = config('app.api_url') . '/api/v1/leaderboards/calculate/' . $leaderboadCode;

            //         $res = Http::withHeaders([
            //             'token' => config('app.api_admin_token')
            //         ])->get($leaderboardRecalculateUrl);

            //         Notification::make()
            //             ->title('Leaderboard started successfull!')
            //             ->info()
            //             ->send();
            //     })
            //     ->visible(function() {
            //         $leaderboadCode = $this->getRecord()->code;

            //         $runningLeaderboard = LeaderboardRun::where('code',$leaderboadCode)
            //             ->where("status","running")
            //             ->first();

            //         return !$runningLeaderboard;
            //     })               
            //     // ->disabled(fn() => !$this->isDataLoaded)
            //     // ->tooltip(fn() => !$this->isDataLoaded ? 'Loading data, please wait...' : null)
            // ->color('info'),

            // Action::make('recalculate_leaderboard')
            //     ->action(function() {
            //         $leaderboadCode = $this->getRecord()->code;

            //         $leaderboardRecalculateUrl = config('app.api_url') . '/api/v1/leaderboards/calculate/' . $leaderboadCode;

            //         $res = Http::withHeaders([
            //             'token' => config('app.api_admin_token')
            //         ])->get($leaderboardRecalculateUrl);

            //         Notification::make()
            //             ->title('Leaderboard calculated successfull!')
            //             ->success()
            //             ->send();
            //     })
            //     ->visible(function() {
            //         $leaderboadCode = $this->getRecord()->code;

            //         $runningLeaderboard = LeaderboardRun::where('code',$leaderboadCode)
            //             ->where("status","running")
            //             ->first();

            //         return $runningLeaderboard;
            //     })
            // ->color('success'),
            // Action::make('end_leaderboard')
            //     ->action(function() {
            //         $leaderboadCode = $this->getRecord()->code;

            //         $leaderboardEndUrl = config('app.api_url') . '/api/v1/leaderboards/end/' . $leaderboadCode;

            //         $res = Http::withHeaders([
            //             'token' => config('app.api_admin_token')
            //         ])->get($leaderboardEndUrl);

            //         Notification::make()
            //             ->title('Leaderboard ended successfull!')
            //             ->danger()
            //             ->send();
            //     })
            //     ->visible(function() {
            //         $leaderboadCode = $this->getRecord()->code;

            //         $runningLeaderboard = LeaderboardRun::where('code',$leaderboadCode)
            //             ->where("status","running")
            //             ->first();

            //         return $runningLeaderboard;
            //     })
            // ->color('danger')
        ];
    }
}
