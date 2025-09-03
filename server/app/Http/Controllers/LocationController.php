<?php

// app/Http/Controllers/LocationController.php
namespace App\Http\Controllers;

use App\Models\Country;
use App\Models\State;
use App\Models\City;

class LocationController extends Controller
{
    public function getCountries()
    {
        return response()->json(Country::all());
    }

    public function getStates($countryId)
    {
        return response()->json(State::where('country_id', $countryId)->get());
    }

    public function getCities($stateId)
    {
        return response()->json(City::where('state_id', $stateId)->get());
    }

    public function getCountry($countryId)
    {
        $country = Country::find($countryId);

        if (!$country) {
            return response()->json(['message' => 'Country not found'], 404);
        }

        return response()->json($country);
    }
}
