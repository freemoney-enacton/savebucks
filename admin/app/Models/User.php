<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use BezhanSalleh\FilamentShield\Traits\HasPanelShield;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Filament\Notifications\Notification;
use Filament\Panel;
// use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements FilamentUser
{   
    protected $table = 'users_admin';

    use HasFactory, Notifiable;
    use HasRoles;
    // use SoftDeletes;
    use HasPanelShield;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        if ($panel->getId() === 'affiliate') {

            $userRoles = $this->getRoleNames()->toArray();


            foreach ($userRoles as $role) {
                if (str_starts_with($role, 'affiliate')) {
                    return true;
                }
            }

            Notification::make()
            ->title('Access Denied')
            ->body('You don\'t have access to the affiliate panel')
            ->danger()
            ->icon('heroicon-o-shield-exclamation')
            ->iconColor('danger')
            ->duration(5000)
            ->persistent()
            ->send();

            return false;
            // abort(403, "Access Denied, You don'y Have Access to the Affiliate Panel");

        }

        return true;
    }
}
